import { act, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/server';
import { renderApp } from '@/test/renderApp';
import { createBookDocument, createBookSearchResponse } from '@/test/fixtures/books';
import { useSearchHistoryStore } from '@/stores/searchHistory/store';

function recordSearches() {
  const requests: URLSearchParams[] = [];
  server.use(
    http.get('http://localhost/api/books', ({ request }) => {
      requests.push(new URL(request.url).searchParams);
      return HttpResponse.json(createBookSearchResponse([createBookDocument()]));
    })
  );
  return requests;
}

describe('검색 페이지', () => {
  it('입력 중에는 요청하지 않고 Enter 제출 때 공백을 정리해 10개를 요청한다', async () => {
    const requests = recordSearches();
    const { user } = renderApp();
    const input = screen.getByRole('searchbox', { name: '검색어' });
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    expect(requests).toHaveLength(0);
    await user.clear(input);
    await user.type(input, ' 무라카미 하루키 ');
    expect(requests).toHaveLength(0);
    await user.keyboard('{Enter}');
    await screen.findByRole('heading', { name: '테스트 도서' });
    expect(requests).toHaveLength(1);
    expect(Object.fromEntries(requests[0])).toEqual({
      query: '무라카미 하루키',
      sort: 'accuracy',
      page: '1',
      size: '10',
    });
    expect(new URLSearchParams(location.search).get('q')).toBe('무라카미 하루키');
    expect(useSearchHistoryStore.getState().searchKeywords).toEqual(['무라카미 하루키']);
  });

  it('빈 응답은 결과 없음으로 표시하고 같은 조건을 다시 제출하면 재요청한다', async () => {
    let count = 0;
    server.use(
      http.get('http://localhost/api/books', () => {
        count++;
        return HttpResponse.json(createBookSearchResponse());
      })
    );
    const { user } = renderApp('/?q=없는책');
    await waitFor(() => expect(count).toBe(1));
    await screen.findByText('검색된 결과가 없습니다.');
    await user.click(screen.getByRole('searchbox', { name: '검색어' }));
    await user.keyboard('{Enter}');
    await waitFor(() => expect(count).toBe(2));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('상세검색은 대상과 검색어를 전달하고 전체검색과 상호 초기화한다', async () => {
    const requests = recordSearches();
    const { user } = renderApp('/?q=전체');
    await screen.findByRole('heading', { name: '테스트 도서' });
    await user.click(screen.getByRole('button', { name: '상세검색' }));
    expect(screen.getByRole('textbox', { name: '상세 검색어' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: '상세 검색어' })).toHaveFocus();
    await user.click(screen.getByRole('combobox', { name: '검색 대상' }));
    await user.click(await screen.findByRole('option', { name: '저자명' }));
    await user.type(screen.getByRole('textbox', { name: '상세 검색어' }), ' 하루키 ');
    await user.click(screen.getByRole('button', { name: '검색하기' }));
    await waitFor(() => expect(requests).toHaveLength(2));
    expect(requests[1].get('target')).toBe('person');
    expect(requests[1].get('query')).toBe('하루키');
    expect(screen.queryByRole('textbox', { name: '상세 검색어' })).not.toBeInTheDocument();
    const input = screen.getByRole('searchbox', { name: '검색어' });
    expect(input).toHaveValue('');
    await user.type(input, '다음{Enter}');
    await waitFor(() => expect(requests).toHaveLength(3));
    expect(requests[2].has('target')).toBe(false);
    await user.click(screen.getByRole('button', { name: '상세검색' }));
    expect(screen.getByRole('textbox', { name: '상세 검색어' })).toHaveValue('');
    expect(screen.getByRole('combobox', { name: '검색 대상' })).toHaveTextContent('제목');
  });

  it('팝업의 미제출 변경은 Escape로 취소하고 트리거에 포커스를 돌려준다', async () => {
    const requests = recordSearches();
    const { user } = renderApp();
    const trigger = screen.getByRole('button', { name: '상세검색' });
    await user.click(trigger);
    await user.type(screen.getByRole('textbox', { name: '상세 검색어' }), '미제출');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(location.search).toBe('');
    expect(requests).toHaveLength(0);
    await user.click(trigger);
    expect(screen.getByRole('textbox', { name: '상세 검색어' })).toHaveValue('');
    await user.click(screen.getByRole('button', { name: '상세검색 닫기' }));
    expect(requests).toHaveLength(0);
  });

  it('직접 URL 접속과 탭 왕복에서 상세 대상·정렬을 보존하고 캐시를 재사용한다', async () => {
    const requests = recordSearches();
    const { user } = renderApp('/?q=하루키&target=publisher&sort=latest');
    await screen.findByRole('heading', { name: '테스트 도서' });
    expect(Object.fromEntries(requests[0])).toMatchObject({
      query: '하루키',
      target: 'publisher',
      sort: 'latest',
    });
    await user.click(screen.getByRole('link', { name: '내가 찜한 책' }));
    expect(new URLSearchParams(location.search).get('target')).toBe('publisher');
    expect(new URLSearchParams(location.search).get('sort')).toBe('latest');
    await user.click(screen.getByRole('link', { name: '도서 검색' }));
    expect(screen.getByRole('heading', { name: '테스트 도서' })).toBeInTheDocument();
    expect(requests).toHaveLength(1);
    expect(useSearchHistoryStore.getState().searchKeywords).toEqual([]);
    expect(screen.getByRole('searchbox', { name: '검색어' })).toHaveValue('');
  });

  it('복원한 검색 기록의 키보드 이동·선택·삭제를 연결한다', async () => {
    localStorage.setItem(
      'cdri-books:search-history',
      JSON.stringify({ version: 2, state: { searchKeywords: ['첫째', '둘째'] } })
    );
    await useSearchHistoryStore.persist.rehydrate();
    const requests = recordSearches();
    const { user } = renderApp();
    const input = screen.getByRole('searchbox', { name: '검색어' });
    await user.click(input);
    const history = screen.getByRole('list', { name: '최근 검색어' });
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(within(history).getByRole('button', { name: '첫째 검색' })).toHaveFocus()
    );
    await user.keyboard('{End}');
    expect(within(history).getByRole('button', { name: '둘째 검색' })).toHaveFocus();
    await user.keyboard('{Home}{ArrowUp}');
    expect(input).toHaveFocus();
    await user.click(within(history).getByRole('button', { name: '첫째 검색 기록 삭제' }));
    expect(requests).toHaveLength(0);
    expect(input).toHaveFocus();
    await user.click(screen.getByRole('button', { name: '둘째 검색' }));
    await screen.findByRole('heading', { name: '테스트 도서' });
    expect(requests[0].get('query')).toBe('둘째');
    expect(screen.queryByRole('list', { name: '최근 검색어' })).not.toBeInTheDocument();
    expect(useSearchHistoryStore.getState().searchKeywords).toEqual(['둘째']);
  });

  it('URL 정규화는 replace, 제출은 push를 쓰며 탭과 뒤로·앞으로 이동 시 조건을 복원한다', async () => {
    recordSearches();
    const { user } = renderApp('/?q=+첫째+&target=invalid&sort=invalid&extra=1');
    const initialLength = history.length;
    await waitFor(() => expect(location.search).toBe('?q=%EC%B2%AB%EC%A7%B8'));
    expect(history.length).toBe(initialLength);
    const input = screen.getByRole('searchbox', { name: '검색어' });
    await user.clear(input);
    await user.type(input, '둘째{Enter}');
    await waitFor(() => expect(new URLSearchParams(location.search).get('q')).toBe('둘째'));
    expect(history.length).toBe(initialLength + 1);
    await user.click(screen.getByRole('link', { name: '내가 찜한 책' }));
    expect(location.pathname).toBe('/favorites');
    expect(new URLSearchParams(location.search).get('q')).toBe('둘째');
    await act(async () => {
      history.back();
    });
    await screen.findByRole('heading', { name: '도서 검색', level: 1 });
    expect(screen.getByRole('searchbox', { name: '검색어' })).toHaveValue('둘째');
    await act(async () => {
      history.back();
    });
    await waitFor(() =>
      expect(screen.getByRole('searchbox', { name: '검색어' })).toHaveValue('첫째')
    );
    await act(async () => {
      history.forward();
    });
    await waitFor(() =>
      expect(screen.getByRole('searchbox', { name: '검색어' })).toHaveValue('둘째')
    );
  });
});

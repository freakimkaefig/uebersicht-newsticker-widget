import { css } from 'uebersicht';

const BASE_URL = 'http://newsapi.org/v2/top-headlines';
const API_KEY = ''; // get API key from https://newsapi.org/
const COUNTRY = 'de'; // ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za
const PAGE_SIZE = 50;
const CATEGORIES = [
  { title: 'All', key: 'all' },
  { title: 'Business', key: 'business' },
  { title: 'Entertainment', key: 'entertainment' },
  { title: 'General', key: 'general' },
  { title: 'Health', key: 'health' },
  { title: 'Science', key: 'science' },
  { title: 'Sports', key: 'sports' },
  { title: 'Technology', key: 'technology' },
];

export const refreshFrequency = 60000;

export const initialState = {
  data: [],
  activeCategory: 'all',
};

export const command = (dispatch) => {
  fetchData(dispatch);
};

export const updateState = (event, previousState) => {
  if (event.error) {
    return {
      ...previousState,
      error: `We got an error: ${event.error}`,
    };
  }

  switch (event.type) {
    case 'FETCH_SUCCEEDED':
      const { data, activeCategory } = event;
      return {
        data: data.articles,
        activeCategory,
      };
    default:
      return previousState;
  }
};

export const render = ({ data, activeCategory, error }, dispatch) => {
  return error ? (
    <div>{error}</div>
  ) : (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, 0); }
        }
        `,
        }}
      />
      <div
        className={cats}
        onClick={(event) => {
          const category = event.target.id;
          localStorage.setItem('activeCategory', category);
          fetchData(dispatch);
        }}
      >
        {CATEGORIES.map((category) => {
          return (
            <div
              key={category.key}
              id={category.key}
              className={category.key === activeCategory ? active : ``}
            >
              {category.title}
            </div>
          );
        })}
      </div>
      <p className={marquee}>
        <span
          className={`${span} ${css({
            animationDuration: `${
              data
                .map((article) => {
                  return article.title;
                })
                .join('   +   ').length / 10
            }s`,
          })}`}
        >
          {data.map((article, index) => {
            return (
              <a key={index} className={link} href={article.url}>
                {article.title}
                <span>
                  &nbsp;&nbsp;&nbsp;<strong>+</strong>&nbsp;&nbsp;&nbsp;
                </span>
              </a>
            );
          })}
        </span>
      </p>
    </div>
  );
};

export const fetchData = (dispatch) => {
  const url = new URL(BASE_URL);
  url.searchParams.append('apiKey', API_KEY);
  url.searchParams.append('country', COUNTRY);
  url.searchParams.append('pageSize', PAGE_SIZE);

  const activeCategory = localStorage.getItem('activeCategory');
  if (activeCategory && activeCategory !== 'all') {
    url.searchParams.append('category', activeCategory);
  }

  fetch(url.href)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return dispatch({
        type: 'FETCH_SUCCEEDED',
        data: data,
        activeCategory,
      });
    })
    .catch((error) => {
      return dispatch({
        type: 'FETCH_FAILED',
        error: error,
      });
    });
};

export const className = `
  left: 0;
  right: 0;
  bottom: 0;
  color: #fff;
  font-family: Helvetica Neue;
  font-weight: 100;
  font-size: 18px;
  padding-bottom: 20px;
`;

const cats = css`
  display: flex;
  flex-direction: row;
  padding: 10px;
  & > div {
    border: 0.05em solid #fff;
    text-align: center;
    padding: 0.175em 0.6em;
    color: #fff;
    border-radius: 0.12em;
    margin: 0 10px;
  }
`;

const active = css`
  color: #000 !important;
  background-color: #fff;
`;

const marquee = css`
  width: 100%;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
`;

const span = css`
  display: inline-block;
  animation: marquee 15s linear infinite;
`;

const link = css`
  color: #fff;
  text-decoration: none;
  transition: all 0.3s;
  &:hover {
    text-decoration: underline;
  }
`;

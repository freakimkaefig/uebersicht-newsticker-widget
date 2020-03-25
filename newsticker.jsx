import { css } from 'uebersicht';

const BASE_URL = 'http://newsapi.org/v2/top-headlines';
const API_KEY = ''; // get API key from https://newsapi.org/
const COUNTRY = 'de'; // ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za
const PAGE_SIZE = 50;

export const refreshFrequency = 60000;

export const initialState = {
    data: [],
    categories: [
        { title: 'All', key: 'all', active: true },
        { title: 'Business', key: 'business', active: false },
        { title: 'Entertainment', key: 'entertainment', active: false },
        { title: 'General', key: 'general', active: false },
        { title: 'Health', key: 'health', active: false },
        { title: 'Science', key: 'science', active: false },
        { title: 'Sports', key: 'sports', active: false },
        { title: 'Technology', key: 'technology', active: false }
    ]
}

export const command = dispatch => {
    let url = new URL(BASE_URL);
    url.searchParams.append('apiKey', API_KEY);
    url.searchParams.append('country', COUNTRY);
    url.searchParams.append('pageSize', PAGE_SIZE);

    fetch(url.href)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return dispatch({
                type: 'FETCH_SUCCEEDED',
                data: data
            });
        })
        .catch(error => {
            return dispatch({
                type: 'FETCH_FAILED',
                error: error
            });
        });
}

export const updateState = (event, previousState) => {
    if (event.error) {
        return {
            ...previousState,
            error: `We got an error: ${event.error}`
        }
    }

    switch (event.type) {
        case 'CHANGE_CATEGORY':
            const { category } = event;
            return {
                ...previousState,
                categories: previousState.categories.map(item => {
                    if (item.key == category) {
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                    return item;
                })
            }
        case 'FETCH_SUCCEEDED':
            const { data } = event;
            return {
                data: data.articles,
                categories: previousState.categories
            };
        default:
            return previousState;
    }
}

export const render = ({ data, categories, error }, dispatch) => {
    return error ? (
        <div>{error}</div>
    ) : (
            <div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                @keyframes marquee {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(-100%, 0); }
                }
            `}} />
                <div className={cats}
                    onClick={(event) => {
                        let category = event.target.id;
                        dispatch({ type: 'CHANGE_CATEGORY', category: category });

                        let url = new URL(BASE_URL);
                        url.searchParams.append('apiKey', API_KEY);
                        url.searchParams.append('country', COUNTRY);
                        url.searchParams.append('pageSize', PAGE_SIZE);
                        if (category !== 'all') {
                            url.searchParams.append('category', category);
                        }

                        fetch(url.href)
                            .then(response => {
                                return response.json();
                            })
                            .then(data => {
                                return dispatch({
                                    type: 'FETCH_SUCCEEDED',
                                    data: data
                                });
                            })
                            .catch(error => {
                                return dispatch({
                                    type: 'FETCH_FAILED',
                                    error: error
                                });
                            });
                    }}>
                    {categories.map(category => {
                        return (
                            <div key={category.key}
                                id={category.key}
                                className={category.active ? active : ``}>
                                {category.title}
                            </div>
                        )
                    })}
                </div>
                <p className={marquee}>
                    <span className={`${span} ${css({
                        animationDuration: `${data.map(article => {
                            return article.title;
                        }).join('   +   ').length / 10}s`

                    })}`}>
                        {data.map((article, index) => {
                            return (
                                <a key={index} className={link} href={article.url}>
                                    {article.title}
                                    <span>&nbsp;&nbsp;&nbsp;<strong>+</strong>&nbsp;&nbsp;&nbsp;</span>
                                </a>
                            )
                        })}
                    </span>
                </p>
            </div>
        );
}

export const className = `
    left: 0;
    right: 0;
    bottom: 0;
    color: #fff;
    font-family: Helvetica Neue;
    font-weight: 100;
    font-size: 18px;
    padding-bottom: 20px;
`

const cats = css`
    display: flex;
    flex-direction: row;
    padding: 10px;
    & > div {
        border: .05em solid #fff;
        text-align: center;
        padding: .175em .6em;
        color: #fff;
        border-radius: .12em;
        margin: 0 10px;
    }
`

const active = css`
    color: #000 !important;
    background-color: #fff;
`

const marquee = css`
    width: 100%;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
`

const span = css`
    display: inline-block;
    animation: marquee 15s linear infinite;
`

const link = css`
    color: #fff;
    text-decoration: none;
    transition: all .3s;
    &:hover {
        text-decoration: underline;
    }
`

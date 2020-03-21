# uebersicht-newsticker-widget
A news ticker for Übersicht using newsapi.org

This widget adds a news ticker to your desktop. The API is provided by newsapi.org, therefore you have to generate an API key from their website which is actually free for developers and individuals.


## Installation

Extract `newsticker.widget.zip` into your Übersicht widget directory.

Add your API key from newsapi.org in the `API_KEY` constant.

```
import 'url';
import { css } from 'uebersicht';

const BASE_URL = 'http://newsapi.org/v2/top-headlines';
const API_KEY = 'ADD_API_KEY_HERE'; // get API key from https://newsapi.org/
const COUNTRY = 'de'; // ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za
const PAGE_SIZE = 50;

...
```

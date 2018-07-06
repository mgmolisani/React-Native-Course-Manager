import 'es6-symbol/implement';
import {WIDGET_BY_LESSON_API_URL} from "../constants/apiConstants";

let _singleton = Symbol();

function errorCallback(data) {
    console.log(data);
    throw new Error(data.message);
}

/**
 * Widget services
 */
export default class WidgetServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new WidgetServiceClient(_singleton);
        return this[_singleton]
    }

    findAllWidgetsForLesson(lessonId, callback) {
        return fetch(WIDGET_BY_LESSON_API_URL
            .replace('LID', lessonId))
            .then(function (response) {
                let responseJson = response.json();
                if (response.ok) {
                    return responseJson.then(callback);
                }
                return responseJson.then(errorCallback);
            });
    }
}
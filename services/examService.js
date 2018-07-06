import 'es6-symbol/implement';
import {EXAM_API_URL, EXAM_BY_LESSON_API_URL} from "../constants/apiConstants";

let _singleton = Symbol();

function errorCallback(data) {
    console.log(data);
    throw new Error(data.message);
}

/**
 * Exam services
 */
export default class ExamServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new ExamServiceClient(_singleton);
        return this[_singleton]
    }

    findExamById(examId, callback) {
        return fetch(EXAM_API_URL + '/' + examId)
            .then(function (response) {
                let responseJson = response.json();
                if (response.ok) {
                    return responseJson.then(callback);
                }
                return responseJson.then(errorCallback);
            });
    }

    createExam(lessonId, exam, callback) {
        return fetch(EXAM_BY_LESSON_API_URL
            .replace('LID', lessonId), {
            method: 'POST',
            body: JSON.stringify(exam),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(callback);
    }

    updateExam(exam, callback) {
        return fetch(EXAM_API_URL + '/' + exam.id, {
            method: 'PUT',
            body: JSON.stringify(exam),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
                let responseJson = response.json();
                if (response.ok) {
                    return responseJson.then(callback);
                }
                return responseJson.then(errorCallback);
            }
        );
    }

    deleteExam(examId, callback) {
        return fetch(EXAM_API_URL + '/' + examId, {
            method: 'DELETE',
        }).then(function (response) {
            if (response.ok) {
                return response.text().then(callback);
            }
            return response.json().then(errorCallback);
        });
    }
}
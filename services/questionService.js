import 'es6-symbol/implement';

let _singleton = Symbol();

function errorCallback(data) {
    console.log(data);
    throw new Error(data.message);
}

/**
 * Question services (differentiated by the input URL arg)
 */
export default class QuestionServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new QuestionServiceClient(_singleton);
        return this[_singleton]
    }

    findQuestionById(url, questionId, callback) {
        return fetch(url + '/' + questionId)
            .then(function (response) {
                let responseJson = response.json();
                if (response.ok) {
                    return responseJson.then(callback);
                }
                return responseJson.then(errorCallback);
            });
    }

    createQuestion(url, examId, question, callback) {
        return fetch(url
            .replace('EID', examId), {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(callback);
    }

    updateQuestion(url, question, callback) {
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(question),
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

    deleteQuestion(url, questionId, callback) {
        return fetch(url + '/' + questionId, {
            method: 'DELETE',
        }).then(function (response) {
            if (response.ok) {
                return response.text().then(callback);
            }
            return response.json().then(errorCallback);
        });
    }
}
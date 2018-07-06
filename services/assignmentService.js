import 'es6-symbol/implement';
import {ASSIGNMENT_API_URL, ASSIGNMENT_BY_LESSON_API_URL} from "../constants/apiConstants";

let _singleton = Symbol();

function errorCallback(data) {
    console.log(data);
    throw new Error(data.message);
}

export default class AssignmentServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new AssignmentServiceClient(_singleton);
        return this[_singleton]
    }

    findAssignmentById(assignmentId, callback) {
        return fetch(ASSIGNMENT_API_URL + '/' + assignmentId)
            .then(function (response) {
                let responseJson = response.json();
                if (response.ok) {
                    return responseJson.then(callback);
                }
                return responseJson.then(errorCallback);
            });
    }

    createAssignment(lessonId, assignment, callback) {
        return fetch(ASSIGNMENT_BY_LESSON_API_URL
            .replace('LID', lessonId), {
            method: 'POST',
            body: JSON.stringify(assignment),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(callback);
    }

    updateAssignment(assignment, callback) {
        return fetch(ASSIGNMENT_API_URL + '/' + assignment.id, {
            method: 'PUT',
            body: JSON.stringify(assignment),
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

    deleteAssignment(assignmentId, callback) {
        return fetch(ASSIGNMENT_API_URL + '/' + assignmentId, {
            method: 'DELETE',
        }).then(function (response) {
            if (response.ok) {
                return response.text().then(callback);
            }
            return response.json().then(errorCallback);
        });
    }
}
import {ScrollView} from "react-native";
import {ListItem} from "react-native-elements";
import {LESSON_API_URL} from "../constants/apiConstants";
import React, {Component} from "react";

function findAllLessonsForModule(courseId, moduleId, callback) {
    return fetch(LESSON_API_URL
        .replace('CID', courseId)
        .replace('MID', moduleId))
        .then(function (response) {
            return response.json();
        }).then(callback);
}

export default class ModuleList
    extends Component {

    static navigationOptions = {title: 'Lesson'};

    constructor(props) {
        super(props);
        this.state = {
            courseId: this.props.navigation.getParam('courseId', 1),
            moduleId: this.props.navigation.getParam('moduleId', 1),
            lessons: {
                byId: {},
                allIds: []
            }
        }
    }

    componentDidMount() {
        findAllLessonsForModule(
            this.state.courseId,
            this.state.moduleId,
            lessons => {
                this.setLessons(lessons);
            });
    }

    setLessons(lessons) {
        this.setState({
            lessons: lessons.reduce((stateLessons, lesson) => {
                stateLessons.byId[lesson.id] = lesson;
                stateLessons.allIds.push(lesson.id);
                return stateLessons;
            }, {
                byId: {},
                allIds: []
            })
        });
    }

    render() {
        return (
            <ScrollView>
                {this.state.lessons.allIds.map(lessonId => {
                    let lesson = this.state.lessons.byId[lessonId];
                    return (<ListItem onPress={() => {
                        this.props.navigation.navigate(
                            "WidgetList",
                            {lessonId}
                        )
                    }}
                                      title={lesson.title}
                                      key={lessonId}/>);
                })}
            </ScrollView>
        )
    }
}

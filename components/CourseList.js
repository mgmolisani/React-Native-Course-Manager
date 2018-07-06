import {ScrollView} from "react-native";
import {ListItem} from "react-native-elements";
import {COURSE_API_URL} from "../constants/apiConstants";
import React, {Component} from "react";

function findAllCourses(callback) {
    return fetch(COURSE_API_URL)
        .then(function (response) {
            return response.json();
        }).then(callback);
}

export default class CourseList
    extends Component {

    static navigationOptions = {title: 'Courses'};

    constructor(props) {
        super(props);
        this.state = {
            courses: {
                byId: {},
                allIds: []
            }
        }
    }

    componentDidMount() {
        findAllCourses(courses => {
            this.setCourses(courses);
        });
    }

    setCourses(courses) {

        this.setState({
            courses: courses.reduce((stateCourses, course) => {
                stateCourses.byId[course.id] = course;
                stateCourses.allIds.push(course.id);
                return stateCourses;
            }, {
                byId: {},
                allIds: []
            })
        });
    }

    render() {
        return (
            <ScrollView>
                {this.state.courses.allIds.map(courseId => {
                    let course = this.state.courses.byId[courseId];
                    return (<ListItem onPress={() => {
                        this.props.navigation.navigate(
                            "ModuleList",
                            {courseId}
                        )
                    }}
                                      title={course.title}
                                      key={courseId}/>);
                })}
            </ScrollView>
        )
    }
}

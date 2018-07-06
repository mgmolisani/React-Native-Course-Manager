import {ScrollView} from "react-native";
import {ListItem} from "react-native-elements";
import {MODULE_API_URL} from "../constants/apiConstants";
import React, {Component} from "react";

function findAllModulesForCourse(courseId, callback) {
    return fetch(MODULE_API_URL
        .replace('CID', courseId))
        .then(function (response) {
            return response.json();
        }).then(callback);
}

export default class ModuleList
    extends Component {

    static navigationOptions = {title: 'Modules'};

    constructor(props) {
        super(props);
        this.state = {
            courseId: this.props.navigation.getParam('courseId', 1),
            modules: {
                byId: {},
                allIds: []
            }
        }
    }

    componentDidMount() {
        findAllModulesForCourse(this.state.courseId,
            modules => {
                this.setModules(modules);
            });
    }

    setModules(modules) {
        this.setState({
            modules: modules.reduce((stateModules, module) => {
                stateModules.byId[module.id] = module;
                stateModules.allIds.push(module.id);
                return stateModules;
            }, {
                byId: {},
                allIds: []
            })
        });
    }

    render() {
        return (
            <ScrollView>
                {this.state.modules.allIds.map(moduleId => {
                    let module = this.state.modules.byId[moduleId];
                    return (<ListItem onPress={() => {
                        this.props.navigation.navigate(
                            "LessonList",
                            {
                                moduleId,
                                courseId: this.state.courseId
                            }
                        )
                    }}
                                      title={module.title}
                                      key={moduleId}/>);
                })}
            </ScrollView>
        )
    }
}

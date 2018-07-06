import {ScrollView} from "react-native";
import {ListItem} from "react-native-elements";
import {MODULE_API_URL} from "../constants/apiConstants";
import React, {Component} from "react";

/**
 * Find modules for course service
 * @param courseId
 * @param callback
 * @returns {Promise<T>}
 */
function findAllModulesForCourse(courseId, callback) {
    return fetch(MODULE_API_URL
        .replace('CID', courseId))
        .then(function (response) {
            return response.json();
        }).then(callback);
}

/**
 * Represents a module list
 */
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

    /**
     * Adds the modules to the list on load
     */
    componentDidMount() {
        findAllModulesForCourse(this.state.courseId,
            modules => {
                this.setModules(modules);
            });
    }

    /**
     * Sets the modules to the state
     * @param modules the modules to set
     */
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

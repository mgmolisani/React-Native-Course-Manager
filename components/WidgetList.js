import {ScrollView, View} from "react-native";
import {Icon, ListItem, Text} from "react-native-elements";
import React, {Component} from "react";
import WidgetServiceClient from "../services/widgetService";

/**
 * Represents a widget list
 */
export default class WidgetList
    extends Component {

    static navigationOptions = {
        title: 'Widgets',
        headerStyle: {
            backgroundColor: 'rebeccapurple'
        },
        headerTintColor: '#fff'
    };

    constructor(props) {
        super(props);
        this.state = {
            lessonId: this.props.navigation.getParam('lessonId', 1),
            widgets: {
                byId: {},
                allIds: []
            }
        };
        this.widgetService = WidgetServiceClient.instance;
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh();
    }

    /**
     * Function called whenever this screen is navigated too
     * It is passed to the other screens as a callback on unmount
     */
    refresh() {
        this.widgetService
            .findAllWidgetsForLesson(
                this.state.lessonId,
                widgets => {
                    this.setWidgets(widgets);
                });
    }

    /**
     * Sets the widgets
     * @param widgets
     */
    setWidgets(widgets) {
        this.setState({
            widgets: widgets.reduce((stateWidgets, widget) => {
                stateWidgets.byId[widget.id] = widget;
                stateWidgets.allIds.push(widget.id);
                return stateWidgets;
            }, {
                byId: {},
                allIds: []
            })
        });
    }

    render() {
        return (
            <ScrollView>
                <View style={{
                    flexDirection: 'row',
                    padding: 15,
                    backgroundColor: 'mediumpurple'
                }}>
                    <Icon name={'list'}
                          color={'white'}/>
                    <Text h4 style={{
                        fontWeight: 'bold',
                        color: 'white',
                        marginLeft: 15
                    }}>
                        Exams
                    </Text>
                </View>
                {this.state.widgets.allIds.map(widgetId => {
                    let widget = this.state.widgets.byId[widgetId];
                    if (widget.widgetType === 'exam') {
                        return (<ListItem onPress={() => {
                            this.props.navigation.navigate(
                                "ExamEditor",
                                {
                                    examId: widgetId,
                                    refreshParent: this.refresh
                                }
                            )
                        }}
                                          title={widget.title}
                                          subtitle={widget.description}
                                          key={widgetId}/>);
                    }
                })}
                <ListItem onPress={() => {
                    this.props.navigation.navigate(
                        "ExamEditor",
                        {
                            lessonId: this.state.lessonId,
                            refreshParent: this.refresh
                        })
                }}
                          chevron={false}
                          rightIcon={{
                              name: 'add'
                          }}
                          title={'Add New Exam'}
                />
                <View style={{
                    flexDirection: 'row',
                    padding: 15,
                    backgroundColor: 'mediumpurple'
                }}>
                    <Icon name={'assignment'}
                          color={'white'}/>
                    <Text h4 style={{
                        fontWeight: 'bold',
                        color: 'white',
                        marginLeft: 15
                    }}>
                        Assignments
                    </Text>
                </View>
                {this.state.widgets.allIds.map(widgetId => {
                    let widget = this.state.widgets.byId[widgetId];
                    if (widget.widgetType === 'assignment') {
                        return (<ListItem onPress={() => {
                            this.props.navigation.navigate(
                                "AssignmentEditor",
                                {
                                    assignmentId: widgetId,
                                    refreshParent: this.refresh
                                }
                            )
                        }}
                                          title={widget.title}
                                          subtitle={widget.description}
                                          key={widgetId}/>);
                    }
                })}
                <ListItem onPress={() => {
                    this.props.navigation.navigate(
                        "AssignmentEditor",
                        {
                            lessonId: this.state.lessonId,
                            refreshParent: this.refresh
                        })
                }}
                          chevron={false}
                          rightIcon={{
                              name: 'add'
                          }}
                          title={'Add New Assignment'}
                />
            </ScrollView>
        )
    }
}

import {ScrollView, StatusBar, View} from "react-native";
import {Button, Divider, FormInput, FormLabel, FormValidationMessage, Text} from "react-native-elements";
import React, {Component} from "react";
import {styles} from "../constants/appConstants";
import assignmentServiceClient from "../services/assignmentService";

export default class AssignmentEditor
    extends Component {

    static navigationOptions = {
        title: 'New Assignment',
        headerStyle: {
            backgroundColor: 'rebeccapurple'
        },
        headerTintColor: '#fff'
    };

    constructor(props) {
        super(props);
        this.state = {
            lessonId: this.props.navigation.getParam('lessonId', null),
            assignmentId: this.props.navigation.getParam('assignmentId', null),
            refreshParent: this.props.navigation.getParam('refreshParent'),
            title: '',
            description: '',
            points: 0,
            fileSaved: false
        };
        this.assignmentService = assignmentServiceClient.instance;
        this.updateForm = this.updateForm.bind(this);
    }

    componentDidMount() {
        if (this.state.assignmentId !== null) {
            this.assignmentService
                .findAssignmentById(
                    this.state.assignmentId,
                    assignment => {
                        this.updateForm({
                            title: assignment.title,
                            description: assignment.description,
                            points: assignment.points
                        });
                    });
        }
    }

    componentWillUnmount() {
        this.state.refreshParent();
    }

    updateForm(update) {
        this.setState(update);
    }

    render() {
        return (
            <View>
                <StatusBar barStyle="light-content"/>
                <ScrollView>
                    <FormLabel>Title</FormLabel>
                    <FormInput onChangeText={
                        text => this.updateForm({title: text})
                    }
                               value={this.state.title}
                               containerStyle={styles.container}
                               inputStyle={styles.input}
                               placeholder={'Enter a title for the assignment...'}
                               underlineColorAndroid={'transparent'}
                    />
                    {this.state.title === '' &&
                    <FormValidationMessage>
                        Title is required
                    </FormValidationMessage>}

                    <FormLabel>Description</FormLabel>
                    <FormInput onChangeText={
                        text => this.updateForm({description: text})
                    }
                               value={this.state.description}
                               containerStyle={styles.container}
                               inputStyle={styles.input}
                               numberOfLines={3}
                               placeholder={'Enter a description for the assignment...'}
                               underlineColorAndroid={'transparent'}
                               multiline={true}
                    />
                    {this.state.description === '' &&
                    <FormValidationMessage>
                        Description is required
                    </FormValidationMessage>}

                    <FormLabel>Points</FormLabel>
                    <FormInput onChangeText={
                        number => this.updateForm({points: number})
                    }
                               onBlur={
                                   () => {
                                       const points = parseFloat(this.state.points.toString());
                                       this.updateForm({points: points >= 0 ? points : 0});
                                   }
                               }
                               value={this.state.points.toString()}
                               containerStyle={styles.container}
                               inputStyle={styles.input}
                               underlineColorAndroid={'transparent'}
                               selectTextOnFocus={true}
                               selectionColor={'mediumpurple'}
                               keyboardType={'numeric'}
                    />
                    {this.state.points === 0 &&
                    <FormValidationMessage labelStyle={{
                        color: 'darkgoldenrod'
                    }}>
                        Warning: Points are currently set to 0
                    </FormValidationMessage>}
                    {this.state.points === '' &&
                    <FormValidationMessage>
                        A point value is required
                    </FormValidationMessage>}

                    <View style={styles.preview}>
                        <Text h3 style={{color: 'rebeccapurple'}}>Preview</Text>
                        <Divider style={{
                            backgroundColor: 'rebeccapurple',
                            marginVertical: 5
                        }}/>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap'
                        }}>
                            <Text h3>
                                {this.state.title}
                            </Text>
                            <Text h3>
                                {this.state.points + ' pts.'}
                            </Text>
                        </View>
                        <Text style={{
                            fontSize: 16
                        }}>
                            {this.state.description}
                        </Text>
                    </View>

                    <FormLabel>Essay answer</FormLabel>
                    <FormInput editable={false}
                               containerStyle={styles.container}
                               inputStyle={styles.input}
                               numberOfLines={3}
                               placeholder={'Enter a plain text answer here...'}
                               underlineColorAndroid={'transparent'}
                               multiline={true}
                    />

                    <FormLabel>Upload file</FormLabel>
                    <Button onPress={() => {
                        this.setState({fileSaved: !this.state.fileSaved})
                    }}
                            backgroundColor={'transparent'}
                            color={'rebeccapurple'}
                            title={this.state.fileSaved ? 'Filename appears here' : 'Upload'}
                            borderRadius={5}
                            buttonStyle={{
                                borderColor: 'rebeccapurple',
                                borderWidth: 2

                            }}
                            containerViewStyle={{
                                marginHorizontal: 15
                            }}/>

                    <FormLabel>Submit a link</FormLabel>
                    <FormInput editable={false}
                               containerStyle={styles.container}
                               inputStyle={styles.input}
                               placeholder={'Enter a link here...'}
                               underlineColorAndroid={'transparent'}
                    />

                    <Divider style={{
                        backgroundColor: 'rebeccapurple',
                        marginTop: 15,
                        marginHorizontal: 15
                    }}/>

                    <Button onPress={() => {
                        if (this.state.assignmentId !== null) {
                            this.assignmentService
                                .updateAssignment({
                                    id: this.state.assignmentId,
                                    title: this.state.title,
                                    description: this.state.description,
                                    points: this.state.points
                                });
                        } else {
                            this.assignmentService
                                .createAssignment(this.state.lessonId, {
                                    title: this.state.title,
                                    description: this.state.description,
                                    points: this.state.points,
                                    widgetType: 'assignment'
                                })
                        }
                        this.props.navigation.goBack();
                    }}
                            backgroundColor={'rebeccapurple'}
                            color={'white'}
                            title={'Save'}
                            borderRadius={5}
                            raised={true}
                            containerViewStyle={{
                                marginTop: 15,
                                marginHorizontal: 15
                            }}/>
                    {(() => {
                        if (this.state.assignmentId !== null) {
                            return (
                                <Button onPress={() => {
                                    this.assignmentService
                                        .deleteAssignment(this.state.assignmentId);
                                    this.props.navigation.goBack();
                                }}
                                        backgroundColor={'red'}
                                        color={'white'}
                                        title={'Delete'}
                                        borderRadius={5}
                                        raised={true}
                                        containerViewStyle={{
                                            marginTop: 15,
                                            marginHorizontal: 15
                                        }}/>)
                        }
                    })()}
                    <Button onPress={() => {
                        this.props.navigation.goBack();
                    }}
                            backgroundColor={'grey'}
                            color={'white'}
                            title={'Cancel'}
                            borderRadius={5}
                            raised={true}
                            containerViewStyle={{
                                marginVertical: 15,
                                marginHorizontal: 15
                            }}/>
                </ScrollView>
            </View>
        )
    }
}


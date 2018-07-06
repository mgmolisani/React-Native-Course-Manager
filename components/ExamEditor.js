import {ScrollView, StatusBar, View} from "react-native";
import {
    Button,
    Card,
    Divider,
    FormInput,
    FormLabel,
    FormValidationMessage,
    ListItem,
    Text
} from "react-native-elements";
import React, {Component} from "react";
import {questionTypes, styles} from "../constants/appConstants";
import examServiceClient from "../services/examService";

/**
 * Represents the base of the exam editor
 */
export default class ExamEditor
    extends Component {

    static navigationOptions = {
        title: 'Exam',
        headerStyle: {
            backgroundColor: 'rebeccapurple'
        },
        headerTintColor: '#fff'
    };

    constructor(props) {
        super(props);
        this.state = {
            lessonId: this.props.navigation.getParam('lessonId', null),
            examId: this.props.navigation.getParam('examId', null),
            refreshParent: this.props.navigation.getParam('refreshParent'),
            title: '',
            description: '',
            points: 0,
            questions: {
                byId: {},
                allIds: []
            }
        };
        this.examService = examServiceClient.instance;
        this.updateForm = this.updateForm.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh()
    }

    /**
     * Called whenever this screen is navigated to to rerender
     * Passed to navigated screens as a callback when unmounted
     */
    refresh() {
        if (this.state.examId !== null) {
            this.examService
                .findExamById(
                    this.state.examId,
                    exam => {
                        this.updateForm({
                            title: exam.title,
                            description: exam.description,
                            points: exam.points,
                            questions: this.setQuestions(exam.questions)
                        });
                    });
        }
    }

    /**
     * Callback to widget list to update
     */
    componentWillUnmount() {
        this.state.refreshParent();
    }

    /**
     * Updates the state
     * @param update
     */
    updateForm(update) {
        this.setState(update);
    }

    /**
     * Sets the questions in the state to the correct format
     * @param questions
     * @returns {*}
     */
    setQuestions(questions) {
        return questions.reduce((stateQuestions, question) => {
            stateQuestions.byId[question.id] = question;
            stateQuestions.allIds.push(question.id);
            return stateQuestions;
        }, {
            byId: {},
            allIds: []
        });
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
                               placeholder={'Enter a title for the exam...'}
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
                               placeholder={'Enter a description for the exam...'}
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

                    <Card title={'Questions'}>
                        {(() => {
                            if (this.state.examId !== null) {
                                return this.state.questions.allIds.map(questionId => {
                                    let question = this.state.questions.byId[questionId];
                                    let iconName = '';
                                    const questionType = Object.values(questionTypes)[question.questionType];
                                    switch (questionType) {
                                        case questionTypes.TRUE_FALSE:
                                            iconName = 'invert-colors';
                                            break;
                                        case questionTypes.MULTIPLE_CHOICE:
                                            iconName = 'format-list-numbered';
                                            break;
                                        case questionTypes.FILL_BLANK:
                                            iconName = 'code';
                                            break;
                                        case questionTypes.ESSAY:
                                            iconName = 'create';
                                            break;
                                        default:
                                            return iconName;
                                    }
                                    return (
                                        <ListItem onPress={() => {
                                            this.props.navigation.navigate(
                                                "QuestionEditor",
                                                {
                                                    questionId,
                                                    questionType: question.questionType,
                                                    refreshParent: this.refresh
                                                }
                                            )
                                        }}
                                                  leftIcon={{
                                                      name: iconName
                                                  }}
                                                  title={question.title}
                                                  key={questionId}/>);
                                })
                            } else {
                                return <Text style={{
                                    fontSize: 16
                                }}>
                                    Questions can only be added once the exam has been saved.
                                </Text>
                            }
                        })()}
                        {(() => {
                            if (this.state.examId !== null) {
                                return <ListItem onPress={() => {
                                    this.props.navigation.navigate(
                                        "QuestionEditor",
                                        {
                                            examId: this.state.examId,
                                            refreshParent: this.refresh
                                        })
                                }}
                                                 chevron={false}
                                                 rightIcon={{
                                                     name: 'add'
                                                 }}
                                                 title={'Add New Question'}
                                />
                            }
                        })()}
                    </Card>

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

                    <Divider style={{
                        backgroundColor: 'rebeccapurple',
                        marginTop: 15,
                        marginHorizontal: 15
                    }}/>

                    <Button onPress={() => {
                        if (this.state.examId !== null) {
                            this.examService
                                .updateExam({
                                    id: this.state.examId,
                                    title: this.state.title,
                                    description: this.state.description,
                                    points: this.state.points
                                });
                        } else {
                            this.examService
                                .createExam(this.state.lessonId, {
                                    title: this.state.title,
                                    description: this.state.description,
                                    points: this.state.points,
                                    widgetType: 'exam'
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
                        if (this.state.examId !== null) {
                            return (
                                <Button onPress={() => {
                                    this.examService
                                        .deleteExam(this.state.examId);
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


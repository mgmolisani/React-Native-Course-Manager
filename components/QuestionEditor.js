import React, {Component} from "react";
import QuestionTypeGroup from "../elements/QuestionTypeGroup";
import {KeyboardAvoidingView, ScrollView, StatusBar} from "react-native";
import {Button, Divider, FormInput, FormLabel, FormValidationMessage} from "react-native-elements";
import {questionTypes, styles} from "../constants/appConstants";
import TrueFalseQuestionEditor from "../elements/TrueFalseQuestionEditor";
import EssayQuestionEditor from "../elements/EssayQuestionEditor";
import FillBlankQuestionEditor from "../elements/FillBlankQuestionEditor";
import MultipleChoiceQuestionEditor from "../elements/MultipleChoiceQuestionEditor";
import questionServiceClient from "../services/questionService";
import {
    BLANK_API_URL,
    BLANK_BY_EXAM_API_URL,
    CHOICE_API_URL,
    CHOICE_BY_EXAM_API_URL,
    ESSAY_API_URL,
    ESSAY_BY_EXAM_API_URL,
    TRUE_FALSE_API_URL,
    TRUE_FALSE_BY_EXAM_API_URL
} from "../constants/apiConstants";

/**
 * Question Editor
 */
export default class QuestionEditor
    extends Component {

    static navigationOptions = {
        title: 'Question',
        headerStyle: {
            backgroundColor: 'rebeccapurple'
        },
        headerTintColor: '#fff'
    };

    constructor(props) {
        super(props);
        this.state = {
            examId: this.props.navigation.getParam('examId', null),
            questionId: this.props.navigation.getParam('questionId', null),
            refreshParent: this.props.navigation.getParam('refreshParent'),
            title: '',
            description: '',
            points: 0,
            questionType: this.props.navigation.getParam('questionType', 0)
        };
        this.changeQuestionType = this.changeQuestionType.bind(this);
        this.setQuestionInfo = this.setQuestionInfo.bind(this);
        this.questionService = questionServiceClient.instance;
    }


    componentDidMount() {
        this.refresh();
    }

    componentWillUnmount() {
        this.state.refreshParent();
    }

    /**
     * Determines if this is to edit or create a question
     */
    refresh() {
        if (this.state.questionId !== null) {
            this.questionService
                .findQuestionById(
                    this.getUrl(),
                    this.state.questionId,
                    question => {
                        this.updateForm(question)
                    });
        }
    }

    /**
     * Gets the service url based on the type
     * @returns {*}
     */
    getUrl() {
        const questionType = Object.values(questionTypes)[this.state.questionType];
        switch (questionType) {
            case questionTypes.TRUE_FALSE:
                return TRUE_FALSE_API_URL;
            case questionTypes.MULTIPLE_CHOICE:
                return CHOICE_API_URL;
            case questionTypes.FILL_BLANK:
                return BLANK_API_URL;
            case questionTypes.ESSAY:
                return ESSAY_API_URL;
            default:
                return null;
        }
    }

    /**
     * Gets the by exam service url based on type
     * @returns {*}
     */
    getUrlByExam() {
        const questionType = Object.values(questionTypes)[this.state.questionType];
        switch (questionType) {
            case questionTypes.TRUE_FALSE:
                return TRUE_FALSE_BY_EXAM_API_URL;
            case questionTypes.MULTIPLE_CHOICE:
                return CHOICE_BY_EXAM_API_URL;
            case questionTypes.FILL_BLANK:
                return BLANK_BY_EXAM_API_URL;
            case questionTypes.ESSAY:
                return ESSAY_BY_EXAM_API_URL;
            default:
                return null;
        }
    }

    /**
     * Updates the state
     * @param update
     */
    updateForm(update) {
        this.setState(update);
    }

    /**
     * changes the type based on what button is pushed.  This is passed to the element.
     * @param itemValue
     */
    changeQuestionType(itemValue) {
        this.setState({questionType: itemValue});
    }

    /**
     * Another state changer.....
     * @param questionInfo
     */
    setQuestionInfo(questionInfo) {
        this.setState({...questionInfo})
    }

    /**
     * Renders the correct type of question editor
     * @returns {*}
     */
    renderQuestionInfo() {
        const questionType = Object.values(questionTypes)[this.state.questionType];
        switch (questionType) {
            case questionTypes.TRUE_FALSE:
                return <TrueFalseQuestionEditor title={this.state.title}
                                                description={this.state.description}
                                                points={this.state.points}
                                                isTrue={this.state.isTrue || false}
                                                setQuestionInfo={this.setQuestionInfo}/>;
            case questionTypes.ESSAY:
                return <EssayQuestionEditor title={this.state.title}
                                            description={this.state.description}
                                            points={this.state.points}/>;
            case questionTypes.FILL_BLANK:
                return <FillBlankQuestionEditor title={this.state.title}
                                                description={this.state.description}
                                                points={this.state.points}
                                                answers={this.state.answers || {}}
                                                setQuestionInfo={this.setQuestionInfo}/>;
            case questionTypes.MULTIPLE_CHOICE:
                return <MultipleChoiceQuestionEditor title={this.state.title}
                                                     description={this.state.description}
                                                     points={this.state.points}
                                                     choices={this.state.choices || []}
                                                     correctChoice={this.state.correctChoice || 0}
                                                     setQuestionInfo={this.setQuestionInfo}/>;
            default:
                throw new Error('Invalid question type chosen');
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'padding'}>
                <StatusBar barStyle="light-content"/>
                <ScrollView>
                    <FormLabel>Title</FormLabel>
                    <FormInput onChangeText={
                        text => this.updateForm({title: text})
                    }
                               value={this.state.title}
                               containerStyle={styles.container}
                               inputStyle={styles.input}
                               placeholder={'Enter a title for the question...'}
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
                               placeholder={'Enter a description for the question...'}
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

                    {(() => {
                        if (this.state.questionId === null) {
                            return <QuestionTypeGroup questionType={this.state.questionType}
                                                      changeQuestionType={this.changeQuestionType}/>
                        }
                    })()}

                    {this.renderQuestionInfo()}

                    <Divider style={{
                        backgroundColor: 'rebeccapurple',
                        marginTop: 15,
                        marginHorizontal: 15
                    }}/>

                    <Button onPress={() => {
                        if (this.state.questionId !== null) {
                            this.questionService
                                .updateQuestion(this.getUrl(),
                                    {
                                        ...this.state,
                                        id: this.state.questionId
                                    });
                        } else {
                            this.questionService
                                .createQuestion(this.getUrlByExam(),
                                    this.state.examId,
                                    this.state)
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
                        if (this.state.questionId !== null) {
                            return (
                                <Button onPress={() => {
                                    this.questionService
                                        .deleteQuestion(
                                            this.getUrl(),
                                            this.state.questionId);
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
            </KeyboardAvoidingView>
        )
    }
}
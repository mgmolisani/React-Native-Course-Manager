import React, {Component} from "react";
import {BLANK_REGEX_STRING, styles} from "../constants/appConstants";
import QuestionPreview from "./QuestionPreview";
import {View} from "react-native";
import {FormInput, Text} from "react-native-elements";

/**
 * Checks if two objects are shallow equal (for knowing to rerender or not in will receive props)
 * @param a
 * @param b
 * @returns {boolean}
 */
function areAnswersEqual(a, b) {
    return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => a[key] === b[key])
}

/**
 * Element to handle fill in the blank specific editing
 */
export default class FillBlankQuestionEditor
    extends Component {

    componentDidMount() {
        this.updateAnswers()
    }

    /**
     * Rerender if required
     * @param nextProps
     * @param nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.description !== this.props.description) {
            this.updateAnswers(nextProps);
        }
    }

    /**
     * Updates the currently stored answers if they are not already equal
     * @param props
     */
    updateAnswers(props = this.props) {
        const description = props.description;
        const answersArray = description.match(new RegExp(BLANK_REGEX_STRING, 'g'));
        let answers = {};
        if (answersArray) {
            answers = answersArray.reduce((stateAnswers, answer) => {
                answer = answer.slice(1, -1);
                const splitIndex = answer.indexOf('=');
                const answerKey = answer.slice(0, splitIndex);
                stateAnswers[answerKey] = answer.slice(splitIndex + 1);
                return stateAnswers;
            }, answers);
        }

        if (!areAnswersEqual(answers, props.answers)) {
            props.setQuestionInfo({answers})
        }
    }

    /**
     * Renders the blanks (incredibly annoying on mobile)
     * @returns {Array}
     */
    getBlanks() {
        const description = this.props.description;
        const textArray = description.split(new RegExp(BLANK_REGEX_STRING, 'g'));
        return textArray.reduce((descriptionWithBlanks, text, index) => {
            descriptionWithBlanks.push(
                <Text key={'text' + index}>
                    {text.trim()}
                </Text>
            );
            if (index !== textArray.length - 1) {
                descriptionWithBlanks.push(
                    <FormInput key={'blank' + index}
                               editable={false}
                               containerStyle={{
                                   marginLeft: 3,
                                   marginRight: 3,
                                   width: 100
                               }}
                               inputStyle={styles.input}
                               underlineColorAndroid={'rebeccapurple'}
                    />
                )
            }
            return descriptionWithBlanks;
        }, []);
    }

    render() {
        return (
            <View>
                <Text style={{
                    marginHorizontal: 15,
                    marginTop: 10,
                    fontSize: 16
                }}
                      textBreakStrategy={'simple'}>
                    In the question description, use the format [variable=value] to create blanks.
                    Replace variable with a unique identifier and value with the correct answer.
                    One variable and value pair can be used in multiple places but every pair should be unique
                    or it will be overwritten and can produce unexpected results.
                </Text>
                <QuestionPreview title={this.props.title}
                                 description={null}
                                 points={this.props.points}/>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginHorizontal: 15
                }}>
                    {this.getBlanks()}
                </View>

            </View>
        )
    }
}
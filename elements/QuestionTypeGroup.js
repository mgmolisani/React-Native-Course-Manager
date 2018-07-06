import React, {Component} from "react";
import {questionTypes} from "../constants/appConstants";
import {ButtonGroup} from "react-native-elements";

/**
 * Element to handle choosing the type of question
 * Only visible during creation
 */
export default class QuestionTypeGroup
    extends Component {

    render() {
        const buttons = Object.values(questionTypes);
        return (
            <ButtonGroup
                onPress={(itemIndex) => {
                    this.props.changeQuestionType(itemIndex);
                }}
                selectedIndex={this.props.questionType}
                buttons={buttons}
                textStyle={{
                    color: 'white',
                    textAlign: 'center'
                }}
                selectedTextStyle={{color: 'white'}}
                buttonStyle={{
                    backgroundColor: 'grey',
                    padding: 12
                }}
                selectedButtonStyle={{backgroundColor: 'rebeccapurple'}}
                containerStyle={{
                    borderRadius: 5,
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 15,
                    marginBottom: 0,
                    height: 50
                }}/>
        )
    }
}
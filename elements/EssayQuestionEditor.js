import React, {Component} from "react";
import QuestionPreview from "./QuestionPreview";
import {View} from "react-native";
import {styles} from "../constants/appConstants";
import {FormInput, FormLabel} from "react-native-elements";

/**
 * Element to handle essay specific editing
 */
export default class EssayQuestionEditor
    extends Component {

    render() {
        return (
            <View>
                <QuestionPreview title={this.props.title}
                                 description={this.props.description}
                                 points={this.props.points}/>
                <FormLabel>Essay answer</FormLabel>
                <FormInput editable={false}
                           containerStyle={styles.container}
                           inputStyle={styles.input}
                           numberOfLines={3}
                           placeholder={'Enter a plain text answer here...'}
                           underlineColorAndroid={'transparent'}
                           multiline={true}
                />
            </View>
        )
    }
}
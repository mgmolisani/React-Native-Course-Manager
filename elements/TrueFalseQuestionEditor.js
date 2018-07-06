import React, {Component} from "react";
import {CheckBox} from "react-native-elements";
import {View} from "react-native";
import QuestionPreview from "./QuestionPreview";

export default class TrueFalseQuestionEditor
    extends Component {

    constructor(props) {
        super(props);
        this.state = {
            previewIsTrue: false
        }
    }

    render() {
        return (
            <View>
                <CheckBox onPress={() => this.props.setQuestionInfo({isTrue: !this.props.isTrue})}
                          checked={this.props.isTrue} title={`The answer is ${this.props.isTrue.toString()
                    .replace(/^[a-z]/, letter => (letter.toUpperCase()))}`}
                          containerStyle={{
                              marginLeft: 15,
                              marginRight: 15,
                              marginTop: 15,
                              marginBottom: 0,
                              borderRadius: 5
                          }}
                          center/>
                <QuestionPreview title={this.props.title}
                                 description={this.props.description}
                                 points={this.props.points}/>
                <CheckBox onPress={() => this.setState({previewIsTrue: !this.state.previewIsTrue})}
                          checked={this.state.previewIsTrue}
                          title={`${this.state.previewIsTrue.toString()
                              .replace(/^[a-z]/, letter => (letter.toUpperCase()))}`}
                          containerStyle={{
                              marginLeft: 15,
                              marginRight: 15,
                              marginTop: 15,
                              marginBottom: 0,
                              borderRadius: 5
                          }}
                          center/>
            </View>
        )
    }
}
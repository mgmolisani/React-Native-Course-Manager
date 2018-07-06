import React, {Component} from "react";
import QuestionPreview from "./QuestionPreview";
import {View} from "react-native";
import {Button, Card, FormInput, ListItem} from "react-native-elements";

export default class MultipleChoiceQuestionEditor
    extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newChoiceText: ''
        }
    }

    addChoice() {
        let choices = [...this.props.choices];
        choices.push(this.state.newChoiceText);
        this.props.setQuestionInfo({choices});
        this.setState({newChoiceText: ''})
    }

    changeCorrectAnswer(correctChoice) {
        this.props.setQuestionInfo({correctChoice})
    }

    changePickedAnswer(pickedChoice) {
        this.setState({pickedChoice})
    }

    removeChoice(index) {
        let choices = [...this.props.choices];
        choices.splice(index, 1);
        if (index <= this.props.correctChoice && this.props.choices.length !== 1) {
            this.props.setQuestionInfo({correctChoice: this.props.correctChoice - 1})
        }
        this.props.setQuestionInfo({choices});
    }

    renderChoices() {
        return this.props.choices.map((choice, index) => (
            <ListItem key={index}
                      onPress={() => {
                          this.changeCorrectAnswer(index)
                      }}
                      onPressRightIcon={() => {
                          this.removeChoice(index)
                      }}
                      leftIcon={
                          index === this.props.correctChoice ?
                              {
                                  name: 'check',
                                  color: 'green'
                              } : {
                                  name: 'close',
                                  color: 'red'
                              }
                      }
                      rightIcon={{
                          name: 'delete'
                      }}
                      title={choice || 'No choice information provided.'}
                      titleNumberOfLines={Infinity}
            />)
        )
    }

    renderPreviewChoices() {
        return this.props.choices.map((choice, index) => (
            <ListItem key={index}
                      onPress={() => {
                          this.changePickedAnswer(index)
                      }}
                      hideChevron={true}
                      leftIcon={
                          index === this.state.pickedChoice ?
                              {
                                  name: 'check',
                                  color: 'green'
                              } : {
                                  name: 'crop-din',
                                  color: 'lightgrey'
                              }}
                      title={choice || 'No choice information provided.'}
                      titleNumberOfLines={Infinity}
            />)
        )
    }

    render() {
        return (
            <View>
                <Card title={'Choices'}>
                    {this.renderChoices()}
                    <FormInput
                        inputStyle={{
                            textAlign: 'left'
                        }}
                        placeholder={'Add new choice text...'}
                        value={this.state.newChoiceText}
                        onChangeText={newChoiceText => {
                            this.setState({newChoiceText})
                        }}
                        containerStyle={{
                            backgroundColor: 'white',
                            padding: 5,
                            borderRadius: 5,
                            marginLeft: 0,
                            marginRight: 0
                        }}
                        multiline={true}
                        underlineColorAndroid={'transparent'}
                    />
                    <Button onPress={() => {
                        this.addChoice()
                    }}
                            backgroundColor={'rebeccapurple'}
                            borderRadius={5}
                            raised={true}
                            containerViewStyle={{
                                marginTop: 10
                            }}
                            icon={{
                                name: 'add',
                                color: 'white'
                            }}/>
                </Card>
                <QuestionPreview title={this.props.title}
                                 description={this.props.description}
                                 points={this.props.points}/>
                <Card title={'Select one of the choices below:'}>
                    {this.renderPreviewChoices()}
                </Card>
            </View>
        )
    }
}
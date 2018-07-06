import {View} from "react-native";
import {Divider, Text} from "react-native-elements";
import React, {Component} from "react";
import {styles} from "../constants/appConstants";

export default class QuestionPreview
    extends Component {

    render() {
        return (
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
                        {this.props.title}
                    </Text>
                    <Text h3>
                        {this.props.points + ' pts.'}
                    </Text>
                </View>
                {(() => (
                    this.props.description ?
                        <Text style={{
                            fontSize: 16
                        }}>
                            {this.props.description}
                        </Text> :
                        null
                ))()}
            </View>
        )
    }
}


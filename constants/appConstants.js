import {StyleSheet} from "react-native";

export const questionTypes = {
    MULTIPLE_CHOICE: 'Multiple Choice',
    ESSAY: 'Essay',
    TRUE_FALSE: 'True or False',
    FILL_BLANK: 'Fill in the Blank'
};

export const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        marginLeft: 15,
        marginRight: 15
    },
    input: {
        minHeight: 0
    },
    preview: {
        marginHorizontal: 15,
        marginTop: 15
    }
});

export const BLANK_REGEX_STRING = '\\[[A-Za-z_]\\w*?=\\w+]';
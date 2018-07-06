import {StyleSheet} from "react-native";

/**
 * Question type enumeration
 * @type {{MULTIPLE_CHOICE: string, ESSAY: string, TRUE_FALSE: string, FILL_BLANK: string}}
 */
export const questionTypes = {
    MULTIPLE_CHOICE: 'Multiple Choice',
    ESSAY: 'Essay',
    TRUE_FALSE: 'True or False',
    FILL_BLANK: 'Fill in the Blank'
};

/**
 * Frequently used styles
 */
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

/**
 * regex for the fill in the blanks
 * @type {string}
 */
export const BLANK_REGEX_STRING = '\\[[A-Za-z_]\\w*?=\\w+]';
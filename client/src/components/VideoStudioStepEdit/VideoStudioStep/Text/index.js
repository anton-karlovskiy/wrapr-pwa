
import React, { Component, Fragment } from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { createGlobalStyle } from "styled-components";
import AddIcon from '@material-ui/icons/NoteAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/TrackChanges';
import domtoimage from 'dom-to-image'; // TODO: browser compatibility -> safari not working 

import RadioButtonsGroup from './RadioButtonsGroup';
import TextsGroup from './TextsGroup';
import SelectTextField from '../../../SelectTextField';
import FontSelectTextField from './FontSelectTextField';
import DropdownColorPicker from '../../../DropdownColorPicker';
import { flexDirection, getSpacingUnit, setMobileFlexSwitch, setResponsiveStyle } from '../../../../utils/utility';
import config from '../../../../config';
import { defaultFontWeight } from '../../../../utils/links';
import IconContainedButton from '../../../IconContainedButton';
import RightIconWrapper from '../../../../hoc/RightIconWrapper';
import { addText, updateText, removeText } from '../../../../actions/videoStepper';
import { setLoadingStatus } from '../../../../actions/loadingStatus';

// TODO: could be managed with database with upload module
// and could add google fonts
const ttfFontList = [
    {
        fontFamily: 'Adam',
        ttf: 'adam.ttf'
    },
    {
        fontFamily: 'Alans',
        ttf: 'alans.ttf'
    },
    {
        fontFamily: 'BeckyBold',
        ttf: 'becky-bold.ttf'
    },
    {
        fontFamily: 'Block',
        ttf: 'block.ttf'
    },
    {
        fontFamily: 'Carly',
        ttf: 'carly.ttf'
    },
    {
        fontFamily: 'Dan',
        ttf: 'dan.ttf'
    },
    {
        fontFamily: 'Donna',
        ttf: 'donna.ttf'
    },
    {
        fontFamily: 'Kid',
        ttf: 'kid.ttf'
    },
    {
        fontFamily: 'LisaBold',
        ttf: 'lisa-bold.ttf'
    },
    {
        fontFamily: 'Mike',
        ttf: 'mike.ttf'
    },
    {
        fontFamily: 'Phil',
        ttf: 'phil.ttf'
    },
    {
        fontFamily: 'Polly',
        ttf: 'polly.ttf'
    },
    {
        fontFamily: 'Scratchy',
        ttf: 'scratchy.ttf'
    },
    {
        fontFamily: 'SkipperBold',
        ttf: 'skipper-bold.ttf'
    },
    {
        fontFamily: 'Tish',
        ttf: 'tish.ttf'
    },
    {
        fontFamily: 'Tom',
        ttf: 'tom.ttf'
    }
];

const generateFontFace = fontList => {
    let fontFace = '';
    fontList.forEach(font => {
        fontFace += `
            @font-face {
                font-family: '${font.fontFamily}';
                src: url('${config.ttfFontListPathPrefix}${font.ttf}');
            }
        `;
    });
    return fontFace;
};

const GlobalStyles = createGlobalStyle`
    ${generateFontFace(ttfFontList)}
`;

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    const breakpoint = 'sm';
    const columnLayout = setMobileFlexSwitch(breakpoint, theme, {});
    const rightPadding = {paddingRight: spacingUnit};
    const leftPadding = {paddingLeft: spacingUnit};
    const subColumn = {
        display: 'flex',
        flexDirection: 'column'
    };
    const withRightPadding = setResponsiveStyle(breakpoint, theme, subColumn, rightPadding);
    const withLeftPadding = setResponsiveStyle(breakpoint, theme, subColumn, leftPadding);
    // pretty look
    const textPreview = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: spacingUnit * 2
    };
    const textPreviewContent = {
        padding: 4
    };

    return {
        columnLayout,
        withRightPadding,
        withLeftPadding,
        textPreview,
        textPreviewContent
    };
};

const previewOptionList = [
    {
        textLabel: 'Text1',
        textValue: '',
        label: 'Preview',
        value: 'text1'
    },
    {
        textLabel: 'Text2',
        textValue: '',
        label: 'Preview',
        value: 'text2'
    },
    {
        textLabel: 'Text3',
        textValue: '',
        label: 'Preview',
        value: 'text3'
    }
];

// TODO: could follow better practice
const textEffectList = effectColor => ([
    {
        label: 'Select Effect',
        value: 0,
        style: 'none'
    },
    {
        label: 'Drop Shadow',
        value: 1,
        style: `1px 6px 2px ${effectColor}`
    },
    {
        label: 'Outline',
        value: 2,
        style: `-1px -1px 0 ${effectColor}, 1px -1px 0 ${effectColor}, -1px 1px 0 ${effectColor}, 1px 1px 0 ${effectColor}`
    },
    {
        label: 'Glow',
        value: 3,
        style: `0px -1px 7px ${effectColor}`
    }
]);

const initialEffectColor = '#2196f3';
class Text extends Component {
    state = {
        optionValue: previewOptionList[0].value,
        text1: '',
        text2: '',
        text3: '',
        fontFamily: ttfFontList[0].fontFamily,
        // text-shadow
        textEffectIndex: 0,
        fontSize: 24,
        fontColor: '#e91e63',
        effectColor: initialEffectColor
    };

    componentDidMount() {
        const { videoStepperTexts } = this.props;
        let texts = {};
        videoStepperTexts.forEach(videoStepperText => {
            texts = {...texts, [videoStepperText.clientId]: videoStepperText.string}
        });
        this.setState(texts);
    }

    previewRadioChangeHandler = event => {
        this.setState({optionValue: event.target.value});
    };

    previewTextChangeHandler = (value, event) => {
        this.setState({[value]: event.target.value});
    };

    fontFamilyChangeHandler = event => {
        this.setState({fontFamily: event.target.value});
    };

    textEffectChangeHandler = event => {
        this.setState({textEffectIndex: event.target.value});
    };

    fontSizeChangeHandler = event => {
        const fontSize = event.target.value >= 0 ? event.target.value : 0;
        this.setState({fontSize});
    };

    fontColorChangeHandler = color => {
        this.setState({fontColor: color.hex});
    };

    effectColorChangeHandler = color => {
        this.setState({effectColor: color.hex});
    };

    // TODO: could improve ux by formating with redux state rather than local state
    updatePreviewTextList = state => {
        previewOptionList[0].textValue = state.text1;
        previewOptionList[1].textValue = state.text2;
        previewOptionList[2].textValue = state.text3;
    };

    shouldAddText = () => {
        const { videoStepperTexts } = this.props;
        const { optionValue } = this.state;

        let shouldWe = false;
        let clientIdExists = false;
        // TODO: break implementation for performance
        videoStepperTexts.forEach(text => {
            if (text.clientId === optionValue) {
                clientIdExists = true;
            }
        });

        if (!clientIdExists && this.state[optionValue]) {
            shouldWe = true;
        }

        return shouldWe;
    };

    shouldUpdateTextWithIndex = () => {
        const { videoStepperTexts } = this.props;
        const { optionValue } = this.state;

        let shouldWe = false;
        let updateIndex = -1;
        // TODO: break implementation for performance
        videoStepperTexts.forEach((text, index) => {
            if (text.clientId === optionValue && this.state[optionValue] && text.string !== this.state[optionValue]) {
                shouldWe = true;
                updateIndex = index;
            }
        });

        return {shouldWe, updateIndex};
    };

    shouldRemoveTextWithIndex = () => {
        const { videoStepperTexts } = this.props;
        const { optionValue } = this.state;

        let shouldWe = false;
        let removeIndex = -1;
        // TODO: break implementation for performance
        videoStepperTexts.forEach((text, index) => {
            if (text.clientId === optionValue) {
                shouldWe = true;
                removeIndex = index;
            }
        });

        return {shouldWe, removeIndex};
    };

    textAddHandler = () => {
        const { addText, editPreviewSwitched, setLoadingStatus } = this.props;
        setLoadingStatus({ 
            loading: true,
            text: "Adding Text..."
        });
        const { optionValue } = this.state;
        if (this._text) {
            const DOMNode = ReactDOM.findDOMNode(this._text);
            domtoimage.toPng(DOMNode)
                .then(dataUrl => {
                    const text = {
                        clientId: optionValue,
                        string: this.state[optionValue],
                        dataUrl
                    };
                    setLoadingStatus({loading: false});
                    addText(text);
                    editPreviewSwitched();
                })
                .catch(function (error) {
                    console.error('oops something went wrong!', error);
                });
        }
    };

    textUpdateHandler = updateIndex => {
        const { updateText, editPreviewSwitched, setLoadingStatus } = this.props;
        setLoadingStatus({ 
            loading: true,
            text: "Updating Text..."
        });
        const { optionValue } = this.state;
        if (this._text) {
            const DOMNode = ReactDOM.findDOMNode(this._text);
            domtoimage.toPng(DOMNode)
                .then(dataUrl => {
                    const text = {
                        clientId: optionValue,
                        string: this.state[optionValue],
                        dataUrl
                    };
                    setLoadingStatus({loading: false});
                    updateText(text, updateIndex);
                    editPreviewSwitched();
                })
                .catch(function (error) {
                    console.error('oops something went wrong!', error);
                });
        }
    };
    
    textRemoveHandler = removeIndex => {
        const { removeText } = this.props;
        removeText(removeIndex);
    };

    render () {
        this.updatePreviewTextList(this.state);
        const {
            fontSize,
            fontFamily,
            effectColor,
            textEffectIndex,
            fontColor,
            optionValue,
        } = this.state;
        const { classes } = this.props;

        const previewStyle = {
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            fontWeight: defaultFontWeight,
            textShadow: textEffectList(effectColor)[textEffectIndex].style,
            color: fontColor
        };

        const updateCheck = this.shouldUpdateTextWithIndex();
        const removeCheck = this.shouldRemoveTextWithIndex();

        return (
            <Fragment>
                <GlobalStyles />
                <div className={classes.textPreview}>
                    <div
                        className={classes.textPreviewContent}
                        ref={r => { this._text = r; }}
                        style={previewStyle}>
                            {this.state[optionValue]}
                    </div>
                </div>
                <Box display="flex" flexDirection="row">
                    <Box flexGrow={1} pr={2}>
                        <TextsGroup
                            textFields={previewOptionList}
                            textChanged={this.previewTextChangeHandler} />
                    </Box>
                    <Box>
                        <RadioButtonsGroup
                            direction={flexDirection.vertical}
                            radioChanged={this.previewRadioChangeHandler}
                            checked={optionValue}
                            radioButtons={previewOptionList} />
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column">
                    <Box flexGrow={1}>
                        <FontSelectTextField
                            label="Font Family"
                            selected={fontFamily}
                            list={ttfFontList}
                            selectionChanged={this.fontFamilyChangeHandler} />
                    </Box>
                    <Box className={classes.columnLayout}>
                        <Box className={classes.withRightPadding} flexGrow={1}>
                            {/* TODO: could make as component */}
                            <TextField
                                label="Font Size"
                                value={fontSize}
                                onChange={this.fontSizeChangeHandler}
                                type="number"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                margin="dense"
                                variant="outlined" />
                            <SelectTextField
                                label="Text Effect"
                                selected={textEffectIndex}
                                list={textEffectList(effectColor)}
                                selectionChanged={this.textEffectChangeHandler} />
                        </Box>
                        <Box className={classes.withLeftPadding} flexGrow={1}>
                            <DropdownColorPicker
                                pickedColor={fontColor}
                                colorChanged={this.fontColorChangeHandler}
                                caption="Font Color:" />
                            <DropdownColorPicker
                                pickedColor={effectColor}
                                colorChanged={this.effectColorChangeHandler}
                                caption="Effect Color:" />
                        </Box>
                    </Box>
                </Box>
                <Box display="flex">
                    { this.shouldAddText() && (
                        <IconContainedButton
                            secondary
                            clicked={this.textAddHandler}>
                            Add
                            <RightIconWrapper>
                                <AddIcon />
                            </RightIconWrapper>
                        </IconContainedButton>
                    ) }
                    { updateCheck.shouldWe && (
                        <IconContainedButton
                            secondary
                            clicked={() => this.textUpdateHandler(updateCheck.updateIndex)}>
                            Update
                            <RightIconWrapper>
                                <UpdateIcon />
                            </RightIconWrapper>
                        </IconContainedButton>
                    ) }
                    { removeCheck.shouldWe && (
                        <IconContainedButton
                            error
                            clicked={() => this.textRemoveHandler(removeCheck.removeIndex)}>
                            Remove
                            <RightIconWrapper>
                                <DeleteIcon />
                            </RightIconWrapper>
                        </IconContainedButton>
                    ) }
                </Box>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    videoStepperTexts: state.videoStepper.texts
});
const mapActionToProps = {
    addText,
    updateText,
    removeText,
    setLoadingStatus
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Text));

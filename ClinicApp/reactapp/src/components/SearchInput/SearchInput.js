import React from 'react';
import {
    FormControl,
    TextField,
    InputAdornment,
    IconButton,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const styles = {
    root: {
        width: '100%',
    },
};

const SearchInputComponent = props => {
    const {
        classes,
        className,
        autoFocus,
        style,
        id,
        label,
        name,
        onChange,
        onSearch,
        value,
        placeholder,
    } = props;

    const handleMouseDown = event => {
        event.preventDefault();
    };

    return (
        <form
            className={clsx(classes.root, className)}
            noValidate
            onSubmit={onSearch}
        >
            <FormControl
                fullWidth
                margin="dense"
                style={style}
            >
                <TextField
                    autoFocus={autoFocus}
                    variant="outlined"
                    margin="dense"
                    name={name}
                    label={label}
                    type="text"
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    type="submit"
                                    edge="end"
                                    aria-label="Search."
                                    onClick={onSearch}
                                    onMouseDown={handleMouseDown}
                                >
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </FormControl>
        </form>
    );
};

SearchInputComponent.propTypes = {
    autoFocus: PropTypes.bool,
    classes: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    value: PropTypes.string,
    style: PropTypes.object,
    placeholder: PropTypes.string,
};

SearchInputComponent.defaultProps = {
    autoFocus: false,
    classes: null,
    id: '',
    label: '',
    name: '',
    onChange: () => { },
    onSearch: () => { },
    value: '',
    style: null,
    placeholder: '',
};

export default withStyles(styles)(SearchInputComponent);

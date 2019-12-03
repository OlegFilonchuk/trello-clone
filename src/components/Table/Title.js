import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import TableTitleForm from './TableTitleForm';

const useStyles = makeStyles({
    titleText: {
        flex: 1,
        cursor: 'pointer',
        paddingTop: 9,
        paddingBottom: 8,
    },
});

const Title = ({ table }) => {
    const classes = useStyles();
    const [isEditingTitle, toggleIsEditingTitle] = useState();

    const handleEditTitleButton = () => toggleIsEditingTitle(true);

    return !isEditingTitle ? (
        <Typography variant="h5" className={classes.titleText} onClick={handleEditTitleButton}>
            {table.title}
        </Typography>
    ) : (
        <TableTitleForm
            toggleIsEditingTitle={toggleIsEditingTitle}
            initialValues={{
                tableTitle: table.title,
            }}
            table={table}
        />
    );
};

Title.propTypes = {};

export default Title;

import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import TableTitleForm from './forms/TableTitleForm';

const useStyles = makeStyles({
    titleText: {
        flex: 1,
        cursor: 'pointer',
        padding: 10,
    },
});

const TableTitle = ({ table }) => {
    const classes = useStyles();
    const [isEditingTitle, toggleIsEditingTitle] = useState();

    const handleEditTitleButton = () => toggleIsEditingTitle(true);

    return (
        <div className={classes.titleText}>
            {!isEditingTitle ? (
                <Typography variant="h5" onClick={handleEditTitleButton}>
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
            )}
        </div>
    );
};

TableTitle.propTypes = {
    table: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        cardIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export default TableTitle;

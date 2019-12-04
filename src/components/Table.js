import React from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Typography, List, IconButton, Paper, makeStyles } from '@material-ui/core';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import { removeTableAction } from '../redux/reducers/tablesReducer';
import { selectCardsForTable } from '../redux/selectors';
import Card from './Card';
import NewCardForm from './forms/NewCardForm';
import TableTitle from './TableTitle';

const useStyles = makeStyles({
    table: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(200,255,234,0.98)',
        padding: 10,
        margin: 5,
        minWidth: 300,
        '&:hover $removeTableButton': {
            opacity: 1,
        },
    },
    list: {
        flexGrow: 1,
        padding: 10,
    },

    createButton: {
        alignSelf: 'flex-start',
    },

    textField: {
        flex: 1,
    },
    noCards: {
        marginLeft: 15,
    },
    removeTableButton: {
        alignSelf: 'flex-end',
        opacity: 0,
        transition: 'opacity .2s ease-in-out',
    },
    footer: {
        display: 'flex',
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
    },
});

/**
 * Representing a table
 */
const Table = (props) => {
    const { table, index } = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const cards = useSelector((state) => selectCardsForTable(state, table.cardIds));

    const handleRemoveTable = () => dispatch(removeTableAction(table.id));

    /**
     * gets a list of cards
     * @returns {(Array.<Card>|HTMLElement)}
     */
    const renderCards = () => {
        return cards.length ? (
            cards.map((item, index) => <Card key={item.id} card={item} index={index} />)
        ) : (
            <Typography className={classes.noCards}>No cards yet...</Typography>
        );
    };

    return (
        <Draggable draggableId={table.id} index={index}>
            {(provided) => (
                <Paper
                    className={classes.table}
                    innerRef={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <TableTitle table={table} />

                    <Droppable droppableId={props.table.id} type="card">
                        {(provided) => (
                            <List
                                className={classes.list}
                                innerRef={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {renderCards()}
                                {provided.placeholder}
                            </List>
                        )}
                    </Droppable>
                    <div className={classes.footer}>
                        <NewCardForm table={table} />

                        <IconButton
                            className={classes.removeTableButton}
                            onClick={handleRemoveTable}
                            title="Remove this table"
                        >
                            <DeleteForeverOutlinedIcon />
                        </IconButton>
                    </div>
                </Paper>
            )}
        </Draggable>
    );
};

Table.propTypes = {
    table: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        cardIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
};

export default Table;

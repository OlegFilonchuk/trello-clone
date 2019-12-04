import React, { useEffect } from 'react';
import { makeStyles, Container, List, Button } from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Table from './Table';
import {
    localDragEndAction,
    globalDragEndAction,
    createTableAction,
} from '../redux/reducers/tablesReducer';
import { changeOrderAction } from '../redux/reducers/orderReducer';
import { getTablesInOrder, selectAllTables, selectOrder } from '../redux/selectors';
import { fetchAllAction } from '../redux/thunk';

const useStyles = makeStyles({
    tableList: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'flex-start',
    },
    createTableButton: {
        alignSelf: 'flex-start',
        margin: 10,
        minWidth: 200,
    },
});

const TABLE = 'table';

/**
 * Representing a board
 */
const Board = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllAction());
    }, [dispatch]);

    const tables = useSelector(selectAllTables);
    const order = useSelector(selectOrder);
    const orderedTables = useSelector(getTablesInOrder);

    const classes = useStyles();

    /**
     * gets a list of tables
     * @returns {Array.<Table>}
     */
    const renderTables = () =>
        orderedTables.map((item, index) => <Table key={item.id} table={item} index={index} />);

    /**
     * handles drag end
     * @param {Object} result
     * @param {Object} result.destination
     * @param {string} result.destination.droppableId
     * @param {number} result.destination.index
     * @param {Object} result.source
     * @param {string} result.source.droppableId
     * @param {number} result.source.index
     * @param {string} result.type
     */
    const onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index)
            return;

        if (type === TABLE) {
            const newTableOrder = [...order];
            newTableOrder.splice(source.index, 1);
            newTableOrder.splice(destination.index, 0, draggableId);

            dispatch(changeOrderAction(newTableOrder));
            return;
        }

        const start = tables.find((item) => item.id === source.droppableId);
        const finish = tables.find((item) => item.id === destination.droppableId);

        if (start === finish) {
            const newCardIds = [...start.cardIds];
            newCardIds.splice(source.index, 1);
            newCardIds.splice(destination.index, 0, draggableId);

            dispatch(localDragEndAction(source.droppableId, newCardIds));
            return;
        }

        const startCardIds = [...start.cardIds];
        startCardIds.splice(source.index, 1);

        const newStart = {
            ...start,
            cardIds: startCardIds,
        };

        const finishCardIds = [...finish.cardIds];
        finishCardIds.splice(destination.index, 0, draggableId);

        const newFinish = {
            ...finish,
            cardIds: finishCardIds,
        };

        dispatch(globalDragEndAction(newStart, newFinish, draggableId));
    };

    /**
     * handles table creating
     */
    const handleCreateTable = () => {
        const newTable = {
            id: '',
            title: 'New table',
            cardIds: [],
        };

        dispatch(createTableAction(newTable));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-tables" direction="horizontal" type={TABLE}>
                {(provided) => (
                    <Container {...provided.droppableProps} innerRef={provided.innerRef}>
                        <List className={classes.tableList}>
                            {renderTables()}
                            {provided.placeholder}
                            <Button
                                onClick={handleCreateTable}
                                className={classes.createTableButton}
                            >
                                <AddOutlinedIcon fontSize="large" />
                                Create new table
                            </Button>
                        </List>
                    </Container>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Board;

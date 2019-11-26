import React, { useEffect } from 'react';
import { makeStyles, Container, List, Button } from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Table from '../Table';
import {
    localDragEndAction,
    globalDragEndAction,
    fetchTablesAction,
    createTableAction,
} from '../../redux/reducers/tablesReducer';
import { fetchCardsAction } from '../../redux/reducers/cardsReducer';
import { fetchOrderAction, changeOrderAction } from '../../redux/reducers/orderReducer';

const useStyles = makeStyles({
    tableList: {
        display: 'flex',
        flexFlow: 'row wrap',
    },
    createTableButton: {
        alignSelf: 'flex-start',
        margin: 10,
    },
});

/**
 * Renders a Board
 * @param props
 * @constructor
 */
const Board = (props) => {
    useEffect(() => {
        dispatch(fetchOrderAction());
        dispatch(fetchTablesAction());
        dispatch(fetchCardsAction());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tables = useSelector((state) => state.tablesState);
    const order = useSelector((state) => state.orderState);
    const dispatch = useDispatch();

    const classes = useStyles(props);

    const getTables = () => {
        if (tables.length) {
            const tablesList = order.map((tableId) => tables.find((item) => item.id === tableId));
            return tablesList.map((item, index) => (
                <Table key={item.id} table={item} index={index} />
            ));
        }
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index)
            return;

        if (type === 'table') {
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

    const handleCreateTableButton = () => {
        const newTable = {
            id: '',
            title: 'New table',
            cardIds: [],
        };

        dispatch(createTableAction(newTable));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-tables" direction="horizontal" type="table">
                {(provided) => (
                    <Container {...provided.droppableProps} innerRef={provided.innerRef}>
                        <List className={classes.tableList}>
                            {getTables()}
                            {provided.placeholder}
                            <Button
                                onClick={handleCreateTableButton}
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

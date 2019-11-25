import React, { useEffect } from 'react';
import { makeStyles, Container, List, Button } from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
    },
});

const Board = (props) => {
    useEffect(() => {
        props.fetchOrder();
        props.fetchTables();
        props.fetchCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles(props);

    const getTables = () => {
        const { tablesState, orderState } = props;

        if (tablesState.length) {
            const tables = orderState.map((tableId) =>
                tablesState.find((item) => item.id === tableId)
            );
            return tables.map((item, index) => <Table key={item.id} table={item} index={index} />);
        }
    };

    const onDragEnd = (result) => {
        const { tablesState, orderState, globalDragEnd, localDragEnd, changeOrder } = props;
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index)
            return;

        if (type === 'table') {
            const newTableOrder = [...orderState];
            newTableOrder.splice(source.index, 1);
            newTableOrder.splice(destination.index, 0, draggableId);

            changeOrder(newTableOrder);
            return;
        }

        const start = tablesState.find((item) => item.id === source.droppableId);
        const finish = tablesState.find((item) => item.id === destination.droppableId);

        if (start === finish) {
            const newCardIds = [...start.cardIds];
            newCardIds.splice(source.index, 1);
            newCardIds.splice(destination.index, 0, draggableId);

            localDragEnd(source.droppableId, newCardIds);
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

        globalDragEnd(newStart, newFinish, draggableId);
    };

    const handleCreateTableButton = () => {
        const newTable = {
            id: Math.random()
                .toString(36)
                .substring(2, 15),
            title: 'New table',
            cardIds: [],
        };

        props.createTable(newTable);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-tables" direction="horizontal" type="table">
                {(provided) => (
                    <Container
                        className={classes.board}
                        {...provided.droppableProps}
                        innerRef={provided.innerRef}
                    >
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

Board.propTypes = {
    tablesState: PropTypes.arrayOf(PropTypes.object).isRequired,
    orderState: PropTypes.arrayOf(PropTypes.string).isRequired,
    localDragEnd: PropTypes.func.isRequired,
    globalDragEnd: PropTypes.func.isRequired,
    fetchCards: PropTypes.func.isRequired,
    fetchTables: PropTypes.func.isRequired,
    fetchOrder: PropTypes.func.isRequired,
    changeOrder: PropTypes.func.isRequired,
    createTable: PropTypes.func.isRequired,
};

const mapStateToProps = ({ tablesState, orderState }) => ({
    tablesState,
    orderState,
});

const mapDispatchToProps = {
    fetchTables: fetchTablesAction,
    localDragEnd: localDragEndAction,
    globalDragEnd: globalDragEndAction,
    fetchCards: fetchCardsAction,
    fetchOrder: fetchOrderAction,
    changeOrder: changeOrderAction,
    createTable: createTableAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);

import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import Table from '../Table'
import {
    localDragEndAction,
    globalDragEndAction,
    fetchTablesAction,
} from '../../redux/reducers/tablesReducer'
import { fetchCardsAction } from '../../redux/reducers/cardsReducer'

const useStyles = makeStyles({
    board: {
        display: 'flex',
        flexFlow: 'row wrap',
    },
})

const Board = (props) => {
    useEffect(() => {
        props.fetchTables()
        props.fetchCards()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const classes = useStyles(props)

    const getTables = () => props.tablesState.map((item) => <Table key={item.id} table={item} />)

    const onDragEnd = (result) => {
        const { tablesState } = props
        const { destination, source, draggableId } = result

        if (!destination) return

        const start = tablesState.find((item) => item.id === source.droppableId)
        const finish = tablesState.find((item) => item.id === destination.droppableId)

        if (start === finish) {
            const newCardIds = [...start.cardIds]
            newCardIds.splice(source.index, 1)
            newCardIds.splice(destination.index, 0, draggableId)

            props.localDragEnd(source.droppableId, newCardIds)
            return
        }

        const startCardIds = [...start.cardIds]
        startCardIds.splice(source.index, 1)

        const newStart = {
            ...start,
            cardIds: startCardIds,
        }

        const finishCardIds = [...finish.cardIds]
        finishCardIds.splice(destination.index, 0, draggableId)

        const newFinish = {
            ...finish,
            cardIds: finishCardIds,
        }

        props.globalDragEnd(newStart, newFinish)
    }

    return (
        <div className={classes.board}>
            <DragDropContext onDragEnd={onDragEnd}>{getTables()}</DragDropContext>
        </div>
    )
}

Board.propTypes = {
    tablesState: PropTypes.arrayOf(PropTypes.object).isRequired,
    localDragEnd: PropTypes.func.isRequired,
    globalDragEnd: PropTypes.func.isRequired,
    fetchCards: PropTypes.func.isRequired,
    fetchTables: PropTypes.func.isRequired,
}

const mapStateToProps = ({ tablesState }) => ({
    tablesState,
})

const mapDispatchToProps = {
    fetchTables: fetchTablesAction,
    localDragEnd: localDragEndAction,
    globalDragEnd: globalDragEndAction,
    fetchCards: fetchCardsAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)

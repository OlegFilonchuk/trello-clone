import React from 'react'
import { makeStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import Table from '../Table'
import { localDragEndAction, globalDragEndAction } from '../../redux/reducers/tablesReducer'

const useStyles = makeStyles({
    board: {
        display: 'flex',
        flexFlow: 'row wrap',
    },
})

const Board = (props) => {
    const classes = useStyles(props)

    const getTables = () =>
        Object.values(props.tablesState).map((item) => <Table key={item.id} table={item} />)

    const onDragEnd = (result) => {
        const { tablesState } = props
        const { destination, source, draggableId } = result

        if (!destination) return

        const start = tablesState[source.droppableId]
        const finish = tablesState[destination.droppableId]

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
    tablesState: PropTypes.objectOf(PropTypes.object).isRequired,
    localDragEnd: PropTypes.func.isRequired,
    globalDragEnd: PropTypes.func.isRequired,
}

const mapStateToProps = ({ tablesState }) => ({
    tablesState,
})

const mapDispatchToProps = {
    localDragEnd: localDragEndAction,
    globalDragEnd: globalDragEndAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)

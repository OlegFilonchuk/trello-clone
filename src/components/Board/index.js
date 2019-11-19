import React from 'react'
import { makeStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import Table from '../Table'
import { dragEndAction } from '../../redux/reducers/tablesReducer'

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
        const { destination, source, draggableId } = result

        if (!destination) return

        const table = props.tablesState[source.droppableId]
        const newCardIds = [...table.cardIds]
        newCardIds.splice(source.index, 1)
        newCardIds.splice(destination.index, 0, draggableId)

        const newTable = {
            ...table,
            cardIds: newCardIds,
        }

        props.dragEnd(newTable)
    }

    return (
        <div className={classes.board}>
            <DragDropContext onDragEnd={onDragEnd}>{getTables()}</DragDropContext>
        </div>
    )
}

const mapStateToProps = ({ tablesState }) => ({
    tablesState,
})

const mapDispatchToProps = {
    dragEnd: dragEndAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)

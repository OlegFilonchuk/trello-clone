import React from "react"
import { makeStyles } from "@material-ui/core"
import Table from "../Table"

const useStyles = makeStyles({
    board: {
        display: "flex",
        flexFlow: "row wrap",
    },
})

const Board = (props) => {
    const classes = useStyles(props)
    return (
        <div className={classes.board}>
            <Table name={"To do"} />
            <Table name={"Doing"} />
            <Table name={"Done"} />
        </div>
    )
}

export default Board

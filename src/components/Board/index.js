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
            <Table id={0} name={"To do"} />
            <Table id={1} name={"Doing"} />
            <Table id={2} name={"Done"} />
        </div>
    )
}

export default Board

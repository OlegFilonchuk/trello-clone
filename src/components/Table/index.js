import React from "react"
import { Typography, makeStyles } from "@material-ui/core"
import Card from "../Card"

const useStyles = makeStyles({
    table: {
        textAlign: "center",
        backgroundColor: "#ddd",
        margin: 20,
    },
})

const Table = (props) => {
    const classes = useStyles(props)
    return (
        <div className={classes.table}>
            <Typography>{props.name}</Typography>
            <Card />
            <Card />
            <Card />
        </div>
    )
}

export default Table

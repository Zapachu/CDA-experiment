import * as React from 'react'
import {Table} from 'antd'
import {DndProvider, DragSource, DropTarget} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

interface IRowProps {
    index: number
    moveRow: (dragIndex: number, hoverIndex: number) => void
}

export function DragTable({data, setData, ...props}) {
    let dragingIndex = -1

    function moveRow(dragIndex, hoverIndex) {
        const newData = []
        data.forEach((d, i) => {
            if (i === dragIndex) {
                return
            }
            if (dragIndex < hoverIndex) {
                newData.push(data[i])
            }
            if (i === hoverIndex) {
                newData.push(data[dragIndex])
            }
            if (dragIndex > hoverIndex) {
                newData.push(data[i])
            }
        })
        setData(newData)
    }

    function BodyRow({isOver, connectDragSource, connectDropTarget, moveRow, ...restProps}) {
        const style = {...restProps.style, cursor: 'move'}
        let {className} = restProps
        if (isOver) {
            if (restProps.index > dragingIndex) {
                className += ' drop-over-downward'
            }
            if (restProps.index < dragingIndex) {
                className += ' drop-over-upward'
            }
        }

        return connectDragSource(
            connectDropTarget(<tr {...restProps} className={className} style={style}/>),
        )
    }

    return <DndProvider backend={HTML5Backend}>
        <Table
            size="middle"
            pagination={false}
            dataSource={data}
            components={{
                body: {
                    row: DropTarget<IRowProps>('row', {
                        drop(props, monitor) {
                            const dragIndex = monitor.getItem().index
                            const hoverIndex = props.index
                            if (dragIndex === hoverIndex) {
                                return
                            }
                            props.moveRow(dragIndex, hoverIndex)
                            monitor.getItem().index = hoverIndex
                        },
                    }, (connect, monitor) => ({
                        connectDropTarget: connect.dropTarget(),
                        isOver: monitor.isOver(),
                    }))(
                        DragSource<IRowProps>('row', {
                            beginDrag(props) {
                                dragingIndex = props.index
                                return {
                                    index: props.index,
                                }
                            },
                        }, connect => ({
                            connectDragSource: connect.dragSource(),
                        }))(BodyRow),
                    ),
                },
            }}
            onRow={(record, index) => ({
                index,
                moveRow,
            } as IRowProps)}
            {...props}
        />
    </DndProvider>
}
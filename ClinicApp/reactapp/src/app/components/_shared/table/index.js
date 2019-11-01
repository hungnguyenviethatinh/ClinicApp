import React, { forwardRef }from 'react';
import MaterialTable from 'material-table';
import { FilterList, FirstPage, LastPage, ChevronRight, ChevronLeft, ArrowUpward } from '@material-ui/icons';

const icons = {
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
};

const options = {
    draggable: false,
    toolbar: false,
};

const Table = props => {
    const { selectedRow } = props;

    const styleSelectedRow = rowData => ({
        backgroundColor: (selectedRow && selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#FFF',
    });

    return (
        <MaterialTable
            icons={icons}
            options={{
                    ...options,
                    rowStyle: styleSelectedRow,
                }
            }
            {...props}
        />
    );
}

export default Table;

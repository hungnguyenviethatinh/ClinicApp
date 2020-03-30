import React from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';

import { icons } from './icons';
import { localization } from './localization';

const Table = props => {
    const { selectedRow, customOptions, pageSizeOptions, ...rest } = props;

    const styleSelectedRow = rowData => ({
        backgroundColor: (
            selectedRow && selectedRow.tableData.id === rowData.tableData.id
        ) ? '#EEE' : '#FFF',
    });

    const { 0: pages } = pageSizeOptions;
    const [pageSize, setPageSize] = React.useState(pages);
    const updatePageSize = (pageSize) => {
		setPageSize(pageSize);
	};

    return (
        <MaterialTable
            components={{
                Container: props => (
                    <Paper elevation={0} {...props} />
                ),
            }}
            icons={icons}
            options={{
                draggable: false,
                toolbar: false,
                rowStyle: styleSelectedRow,
                pageSize,
                pageSizeOptions,
                debounceInterval: 500,
                ...customOptions,
            }}
            localization={localization}
            pageSize={pageSize}
			onChangeRowsPerPage={(pageSize) => { updatePageSize(pageSize) }}
            {...rest}
        />
    );
}

Table.propTypes = {
    customOptions: PropTypes.object,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
};

Table.defaultProps = {
    customOptions: { },
    pageSizeOptions: [10, 20, 50],
};

export default Table;

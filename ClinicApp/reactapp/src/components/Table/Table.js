import React from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';

import { icons } from './icons';
import { localization } from './localization';

const Table = props => {
    const { selectedRow, customOptions, ...rest } = props;

    const styleSelectedRow = rowData => ({
        backgroundColor: (
            selectedRow && selectedRow.tableData.id === rowData.tableData.id
        ) ? '#EEE' : '#FFF',
    });

    const [pageSize, setPageSize] = React.useState(5);
    const updatePageSize = (pageSize) => {
		setPageSize(pageSize);
	};

    return (
        <MaterialTable
            icons={icons}
            options={{
                draggable: false,
                toolbar: false,
                rowStyle: styleSelectedRow,
                pageSize,
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
};

export default Table;

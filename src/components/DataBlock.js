import React from 'react';
import _DataBlockHeader from "../containers/DataBlockHeader"
import _DataBlockCard from "../containers/DataBlockCard"

const DataBlock = ({ dataLen }) => {
  return (
    <div className="p-3">
      <_DataBlockHeader />
      {(() => {
          let ret = []
          for (let i = 0; i < dataLen; i++) {
            ret.push(<_DataBlockCard key={i} dataPtKey={i}/>)
          }
          return ret
      })()}
    </div>
  )
}

export default DataBlock

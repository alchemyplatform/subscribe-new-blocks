import { Alchemy, Network } from "alchemy-sdk";
import React, { useEffect, useState } from "react";
import styles from "../styles/Blocks.module.css";

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const BLOCK_LIMIT = 10;

  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
  };
  const alchemy = new Alchemy(settings);

  useEffect(() => {
    if (blocks.length === 0) {
      alchemy.core.getBlock().then((block) => {
        setBlocks([block]);
      });
    }
    alchemy.ws.on("block", async (blockNumber) => {
      const newBlock = await alchemy.core.getBlock(blockNumber);

      setBlocks((prevBlocks) => {
        if (prevBlocks.length != 0 && newBlock.number == prevBlocks[0].number) {
          return [...prevBlocks];
        }
        if (prevBlocks.length >= BLOCK_LIMIT) {
          return [newBlock, ...prevBlocks.splice(-1)];
        }
        return [newBlock, ...prevBlocks];
      });
    });

    return () => {
      alchemy.ws.removeAllListeners("block");
    };
  }, []);

  return (
    <div className={styles.blocks_container}>
      {blocks.map((block, index) => {
        const date = new Date(block.timestamp * 1000);
        const formattedDate = date.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        });
        let gas_ratio =
          parseInt(block.gasUsed._hex, 16) / parseInt(block.gasLimit._hex, 16);
        gas_ratio = (gas_ratio * 100).toString() + "%";

        return (
          <div className={styles.block_container} key={index}>
            <div className={styles.box_gas_container}>
              <div
                className={styles.block_gas}
                style={{ height: gas_ratio }}
              ></div>
            </div>
            <div className={styles.block_info}>
              <div>
                <b>{block.number}</b>
              </div>
              <div>{formattedDate}</div>
              <div>{block.transactions.length} Txs</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Blocks;

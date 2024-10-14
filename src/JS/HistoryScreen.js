import React, { useState } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import '../CSS/HistoryScreen.css';

function HistoryScreen({ history }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleDetails = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="history-container">
            <h2>Generation History</h2>
            {Array.isArray(history) && history.length === 0 ? (
                <p>No history available.</p>
            ) : (
                <ul className="history-list">
                    {history.map((item, index) => (
                        <li key={index} className="history-item">
                            <button
                                onClick={() => toggleDetails(index)}
                                className="query-button"
                            >
                                Query No. {index + 1}
                            </button>
                            {expandedIndex === index && (
                                <div className="history-details">
                                    <div>
                                        <strong>Diagram:</strong> {item.diagram}
                                    </div>
                                    <div>
                                        <strong>Generated XML:</strong>
                                        <pre>{item.xml}</pre>
                                    </div>
                                    <div>
                                        <strong>HTML Preview:</strong>
                                        <div className="html-preview">
                                            {item.html ? parse(item.html) : <p>No HTML content available.</p>}
                                        </div>
                                    </div>
                                    <div className="timestamp">
                                        <em>Generated on: {item.timestamp}</em>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

HistoryScreen.propTypes = {
    history: PropTypes.arrayOf(
        PropTypes.shape({
            diagram: PropTypes.string.isRequired,
            xml: PropTypes.string.isRequired,
            html: PropTypes.string,
            timestamp: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default HistoryScreen;
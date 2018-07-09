import React from 'react';
import { Row, Col, Card } from 'antd';
import D3Charts from './ForceDChart';

class Charts extends React.Component {
    render() {
        return (
            <div className="gutter-example simple-force-chart-demo">
                <Row gutter={10}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="D3 简单力导向图" bordered={false}>
                                <D3Charts />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Charts;

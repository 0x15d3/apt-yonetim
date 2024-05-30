import { Component, createRef, ReactNode } from 'react';
import { Button, Form, Input, Modal, Select, Steps, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SiteEntity, createSite } from '../../firebase/site';
import { FormInstance } from 'antd/lib/form';
import { CSSProperties } from 'react';
import { getAnalytic, getAuthService } from '../../firebase';
import { logEvent } from 'firebase/analytics';
interface BotCreationButtonProps {
    disabled?: boolean;
    children?: ReactNode;
}

interface BotCreationButtonState {
    modalVisible: boolean;
    requesting: boolean;
    currentStep: number;
    formValues: any;
}

const formStyle: CSSProperties = {
    marginTop: '24px',
};

class BotCreationButton extends Component<BotCreationButtonProps, BotCreationButtonState> {
    state = {
        modalVisible: false,
        requesting: false,
        currentStep: 0,
        formValues: {
            yoneticiid: getAuthService().currentUser?.uid,
            type: ''
        },
    };

    formRef = createRef<FormInstance>();

    handleTypeChange = (value) => {
        this.setState(({ formValues }) => ({
            formValues: {
                ...formValues,
                type: value,
            },
        }));
    };

    showModal = () => {
        logEvent(getAnalytic(), 'create_site_start');
        this.setState({
            modalVisible: true,
        });
    };

    showError = (error: string) => {
        logEvent(getAnalytic(), 'create_site_show_error');
        this.setState({
            requesting: false,
        });
        Modal.error({
            content: error,
        });
    };

    onOK = () => {
        this.formRef.current
            ?.validateFields()
            .then(lastValues => {
                logEvent(getAnalytic(), 'create_site_finish');
                const values = {
                    ...this.state.formValues,
                    ...lastValues,
                };
                this.setState({
                    requesting: true,
                });
                createSite(values as SiteEntity)
                    .then(data => {
                        const siteId = data.id;
                        if (!siteId) {
                            this.showError('Oluşturlan sitenin IDsini alamadım...');
                        } else {
                            this.setState({
                                modalVisible: false,
                            });
                            location.reload()
                        }
                    })
                    .catch(({ message }) => this.showError(message));
            })
            .catch(() => { });
    };

    onCancel = () => {
        logEvent(getAnalytic(), 'create_site_cancel');
        const { requesting } = this.state;

        if (!requesting) {
            this.setState({
                modalVisible: false,
            });
        }
    };

    onPrevious = () => {
        this.setState(({ currentStep }) => ({ currentStep: currentStep - 1 }));
    };

    onNext = () => {
        const moveToNextStep = (values: any) =>
            this.setState(({ currentStep, formValues }) => ({
                currentStep: currentStep + 1,
                formValues: {
                    ...formValues,
                    ...values,
                },
            }));
        this.formRef.current
            ?.validateFields()
            .then(values => {
                    moveToNextStep(values);
            })
            .catch(() => { });
    };

    render() {
        const { disabled, children = 'Bir Site Oluştur' } = this.props;
        const { formValues, modalVisible, requesting, currentStep } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <>
                <Button
                    data-testid="site-creation-button"
                    type="primary"
                    icon={<PlusOutlined />}
                    disabled={disabled}
                    onClick={this.showModal}
                >
                    {children}
                </Button>
                <Modal
                    open={modalVisible}
                    onOk={this.onOK}
                    onCancel={this.onCancel}
                    footer={
                        <>
                            {currentStep > 0 && (
                                <Button key="previous" disabled={requesting} onClick={this.onPrevious}>
                                    Geri
                                </Button>
                            )}
                            {currentStep < 2 && (
                                <Button type="primary" key="next" loading={requesting} disabled={requesting} onClick={this.onNext}>
                                    Devam
                                </Button>
                            )}
                            {currentStep === 2 && (
                                <Button key="ok" type="primary" loading={requesting} onClick={this.onOK}>
                                    Oluştur
                                </Button>
                            )}
                        </>
                    }
                    title="Site Oluştur"
                >
                    <Steps current={currentStep}>
                        <Steps.Step key={0} title="Bilgiler" />
                        <Steps.Step key={1} title="Hakkında" />
                    
                    <Steps.Step key={2} title="Sayılar" />
                    </Steps>
                    <Form data-testid="site-creation-form" ref={this.formRef} name="site-creation-form" style={formStyle} initialValues={formValues} {...formItemLayout}>
                        {currentStep === 0 && (
                            <>
                                <Typography.Paragraph>Lütfen gerekli alanları doldurun</Typography.Paragraph>
                                <Form.Item name="type" label="Tür" rules={[{ required: true, message: 'Tür seçin.' }]} >
                                <Select placeholder="Tür Seçin" onChange={this.handleTypeChange}>
                                    <Select.Option value={"apartman"}>
                                        Apartman
                                    </Select.Option>
                                    <Select.Option value={"site"}>
                                        Site
                                    </Select.Option>
                                </Select>
                                </Form.Item>
                                <Form.Item name="isim" label="Ad" rules={[{ required: true, message: 'Sitenizi adlandırın!' }]}>
                                    <Input placeholder="A Sitesi" />
                                </Form.Item>
                                <Form.Item name="aciklama" label="Açıklama" rules={[{ required: true, message: 'Açıklama zorunludur!' }]}>
                                    <Input placeholder="Botumun açıklaması" />
                                </Form.Item>
                            </>
                        )}
                        {currentStep === 1 && (
                            <>
                                <Typography.Paragraph>Lütfen gerekli alanları doldurun</Typography.Paragraph>
                                <Form.Item name="sehir" label="Şehir" rules={[{ required: true, message: 'Şehir seçin.' }]}>
                                    <Select>
                                        <Select.Option key={"istanbul"} value={"istanbul"}>
                                            İstanbul
                                        </Select.Option>
                                        <Select.Option key={"ankara"} value={"ankara"}>
                                            Ankara
                                        </Select.Option>
                                        <Select.Option key={"adana"} value={"adana"}>
                                            Adana
                                        </Select.Option>
                                        <Select.Option key={"izmir"} value={"izmir"}>
                                            İzmir
                                        </Select.Option>
                                        <Select.Option key={"antalya"} value={"antalya"}>
                                            Antalya
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="adres" label="Adres" rules={[{ required: true, message: 'Adres zorunludur.' }]}>
                                    <Input placeholder="Adres" />
                                </Form.Item>
                            </>
                        )}
                        {currentStep === 2 && (
                            <>
                                <Typography.Paragraph>Lütfen gerekli alanları doldurun</Typography.Paragraph>
                                {formValues.type === 'site' ? (
                                    <Form.Item name="bloksayisi" label="Blok Sayısı" rules={[{ required: true, message: 'Blok sayısı zorunludur!' }]}>
                                        <Input type='number' placeholder="5" />
                                    </Form.Item>
                                ) : (
                                    <Form.Item name="dairesayisi" label="Daire Sayısı" rules={[{ required: true, message: 'Daire sayısı zorunludur!' }]}>
                                        <Input type='number' placeholder="10" />
                                    </Form.Item>
                                )}
                                <Form.Item name="gorevlisayisi" label="Görevli Sayısı" rules={[{ required: false}]}>
                                    <Input type='number' placeholder="2" />
                                </Form.Item>
                            </>
                        )}
                    </Form>
                </Modal>
            </>
        );
    }
}

export default BotCreationButton;
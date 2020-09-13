import React, {
  ComponentType,
  forwardRef,
  memo,
  MemoExoticComponent,
  useCallback,
  useEffect,
  useState
} from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { getProxyItemById, ProxyItem, ProxyStatus, proxyStatusMapper } from '@/services/proxy';
import createOpen, { ModalComponentProps } from '@/utils/createOpen';

type FormDataType = Omit<ProxyItem, 'id' | 'createdAt' | 'updatedAt'>;
type ModalData = FormDataType & { id?: number };

export interface ProxyItemEditorProps extends ModalComponentProps<ModalData> {
  onOk: (data: ModalData) => void;
  onCancel: () => void;
  afterClose?: () => void;
  visible: boolean;
  id?: number;
}

const ProxyItemEditor: MemoExoticComponent<ComponentType<ProxyItemEditorProps>> = memo(
  forwardRef((props: ProxyItemEditorProps, ref: any) => {
    const { onOk, onCancel, afterClose, id, visible } = props;
    const [disableStatus, setDisableStatus] = useState(true);
    const [form] = Form.useForm();
    const handleOk = useCallback(async () => {
      await form.validateFields();
      const data = form.getFieldsValue();
      onOk({ ...data, id });
    }, [id, onOk, form]);

    useEffect(() => {
      if (!id) {
        form.setFieldsValue({ status: ProxyStatus.running });
        setDisableStatus(false);
        return;
      }
      getProxyItemById(id).then((res) => {
        form.setFieldsValue(res);
        setDisableStatus(res.urlPattern === '/management');
      });
    }, [id, form]);

    return (
      <Modal
        visible={visible}
        onOk={handleOk}
        onCancel={onCancel}
        afterClose={afterClose}
        title={id ? '编辑代理' : '创建代理'}
      >
        <Form<FormDataType>
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          form={form}
          labelAlign="left"
          ref={ref}
        >
          <Form.Item
            label="URL匹配"
            name="urlPattern"
            rules={[{ required: true, message: '请填写匹配规则' }]}
          >
            <Input placeholder="请填写匹配规则" />
          </Form.Item>
          <Form.Item
            label="代理服务"
            name="proxyServer"
            rules={[{ required: true, message: '请填写代理服务', type: 'url' }]}
          >
            <Input placeholder="请填写代理服务" />
          </Form.Item>
          <Form.Item
            label="测试URL"
            name="testUrl"
            rules={[{ required: true, message: '请填写测试URL', type: 'url' }]}
          >
            <Input placeholder="请填写测试URL" />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true }]}>
            <Select disabled={disableStatus}>
              {Object.keys(proxyStatusMapper).map((key) => (
                <Select.Option value={Number(key)} key={key}>
                  {proxyStatusMapper[key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  })
);

export default ProxyItemEditor;

export const open = createOpen<ModalData, ProxyItemEditorProps>(ProxyItemEditor);

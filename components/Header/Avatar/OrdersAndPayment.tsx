import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TriangleAlert } from 'lucide-react';

import Modal from './Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { useDialogStore } from '@/stores/useDialogStore';
import { useAlertStore } from '@/stores/useAlertStore';
import { paymentList, PaymentType } from '@/components/Membership';
import { payment, common } from '@/lib/api';
import { eventBus } from '@/utils/events';

// 邮箱验证函数
const validateEmail = (email: string): boolean => {
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return EMAIL_REGEX.test(email);
};

export interface BillingHistoryItem {
  dueDate: string;
  description: string;
  status: 'Success' | 'Failed' | 'Pending';
  invoice: string;
}

const AccountSettingsDrawer = React.memo(
  ({
    open,
    onOpenChange,
    handleOpenMembership
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    handleOpenMembership: (type: PaymentType) => void;
  }) => {
    const { subscribeLevel, billingEmail, renewTime } = usePersonalInfoStore();
    // 编辑用户名的输入框的值
    const [newEmail, setNewEmail] = useState(billingEmail);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    // bill history begins
    const [tableData, setTableData] = useState<BillingHistoryItem[]>([]); // bill history table data
    const [hasMore, setHasMore] = useState(true); // bill history has more
    const [page, setPage] = useState(1); // bill history page
    const PAGE_SIZE = 10; // bill history page size
    // bill history ends

    const { showConfirm } = useDialogStore();
    const { showAlert } = useAlertStore();

    const planInfo = paymentList
      .find(item => item.title === 'Plan')
      ?.type.find(item => item?.subscribeLevel === subscribeLevel);

    const loadInitialHistory = useCallback(async () => {
      try {
        const res = await payment.queryBillingHistory(1, PAGE_SIZE);
        if (res.code === 0) {
          setTableData(res.data.list);
          setPage(2);
          setHasMore(res.data.list.length < res.data.total);
        } else {
          showAlert({
            type: 'error',
            content: res.message || res.msg || 'Failed to query billing history'
          });
        }
      } catch (error: any) {
        showAlert({
          type: 'error',
          content: error.message || 'Failed to query billing history'
        });
      }
    }, [showAlert]);

    const loadMoreHistory = useCallback(async () => {
      if (!hasMore) return;
      try {
        const res = await payment.queryBillingHistory(page, PAGE_SIZE);
        if (res.code === 0) {
          setTableData(prevData => [...prevData, ...res.data.list]);
          setPage(prevPage => prevPage + 1);
          setHasMore(tableData.length + res.data.list.length < res.data.total);
        } else {
          showAlert({
            type: 'error',
            content: res.message || res.msg || 'Failed to query billing history'
          });
        }
      } catch (error: any) {
        showAlert({
          type: 'error',
          content: error.message || 'Failed to query billing history'
        });
      }
    }, [page, hasMore, tableData.length, showAlert]);

    // 取消订阅
    const handleCancelSubscription = () => {
      showConfirm({
        icon: (
          <div className="w-full h-full rounded-full bg-[#f9f5ff] flex items-center justify-center">
            <TriangleAlert color="#ff3c2e" className="w-full h-full" />
          </div>
        ),
        title: 'Are you sure you want to cancel your subscription?',
        onConfirm: async () => {
          try {
            const res = await payment.handleCancelSubscribe();
            if (res.code === 0) {
              showAlert({
                type: 'success',
                content: 'Subscription cancelled successfully'
              });
            } else {
              showAlert({
                type: 'error',
                content: res.message || res.msg || 'Failed to cancel subscription'
              });
            }
          } catch (error: any) {
            showAlert({
              type: 'error',
              content: error.message || 'Failed to cancel subscription'
            });
          }
        }
      });
    };

    const handleSaveEmail = () => {
      if (!validateEmail(newEmail)) {
        setIsEmailValid(false);
        return;
      }

      setIsEmailValid(true);
      handleUpdateUserInfo({ billingEmail: newEmail });
    };

    // 更新用户信息
    const handleUpdateUserInfo = useCallback((updates: { billingEmail?: string | null }) => {
      const updatePayload: { billingEmail: string | null } = {
        billingEmail: null
      };

      if (updates.billingEmail) {
        updatePayload.billingEmail = updates.billingEmail;
      }

      common
        .updateUserInfo(updatePayload)
        .then(res => {
          // 处理响应
          if (res.code === 0) {
            setIsEditingEmail(false);
          } else {
            showAlert({
              type: 'error',
              content: res.message || res.msg || 'Failed to update billing email'
            });
          }
        })
        .catch((error: any) => {
          showAlert({
            type: 'error',
            content: error.message || 'Failed to update billing email'
          });
        });
    }, []);

    // 组件挂载时检查登录状态并加载数据
    useEffect(() => {
      const token = localStorage.getItem('auth_token') || '';
      if (token) {
        loadInitialHistory();
      }
    }, [loadInitialHistory]);

    // 监听登录成功事件
    useEffect(() => {
      const onLoginSuccess = () => {
        loadInitialHistory();
      };

      eventBus.on('auth:login-success', onLoginSuccess);
      return () => {
        eventBus.off('auth:login-success', onLoginSuccess);
      };
    }, [loadInitialHistory]);

    const sections = [
      {
        title: 'Current subscription',
        content: (
          <div className="flex items-center justify-between pb-6 border-b border-[#EFF3F6]">
            <div className="">
              {subscribeLevel === 0 ? (
                <div className="text-[#0A1532] text-xl font-bold">No Current subscription</div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-start gap-4">
                    <Image
                      src={`/images/membership/${planInfo?.logo}`}
                      alt="sparkles"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                    <div>
                      <span className="text-[#0A1532] text-base font-inter font-medium leading-[22px]">
                        {planInfo?.title} - $ {planInfo?.price} per month
                      </span>
                      <div className="text-gray-40 font-inter text-xs font-normal leading-[20px]">
                        Your subscription will renew on {dayjs(renewTime).format('MMM DD, YYYY')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              {subscribeLevel === 0 ? (
                <Button
                  onClick={() => {
                    handleOpenMembership('Plan');
                    onOpenChange(false);
                  }}
                  variant="default"
                  className="p-2 py-0 h-[28px] w-[180px] rounded-[20px] border-none text-white hover:text-[#f0f0f0] text-[14px] leading-[20px] bg-[linear-gradient(69deg,_rgba(0,_143,_247,_0.40)_-34.18%,_rgba(160,_144,_249,_0.40)_5.53%,_rgba(239,_108,_188,_0.40)_42.97%,_rgba(249,_121,_23,_0.40)_82.53%)]"
                >
                  Subscribe Now
                </Button>
              ) : (
                <Button
                  variant="primarySecondary"
                  className="p-2 py-0 h-[28px] w-[180px]"
                  onClick={handleCancelSubscription}
                >
                  Cancel subscription
                </Button>
              )}
            </div>
          </div>
        )
      },
      {
        title: 'Billing information',
        content: (
          <div className="flex items-center flex-col">
            <div className="w-full">
              <div className="flex items-center justify-between w-full mb-4 relative gap-4">
                <div className="flex flex-1 items-center justify-start gap-3">
                  <div className="text-base font-medium text-[#0A1532]">E-mail address</div>
                  <div className="flex-grow text-[#999] text-[20px] leading-6 font-light">
                    {isEditingEmail ? (
                      <>
                        <div className="max-w-[280px]">
                          <Input
                            type="text"
                            placeholder="New Email"
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                            className="h-[42px]"
                          />
                        </div>
                        {!isEmailValid && (
                          <div className="text-red-500 text-xs mt-1">Please enter a valid email address</div>
                        )}
                      </>
                    ) : (
                      <span className="text-primary text-base font-medium">{billingEmail}</span>
                    )}
                  </div>
                </div>
                <div className=" shrink-0">
                  {isEditingEmail ? (
                    <div className="flex items-center justify-start gap-2">
                      <Button
                        variant="primarySecondary"
                        className="h-[32px] w-[84px] shrink-0"
                        onClick={() => {
                          setNewEmail('');
                          setIsEditingEmail(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        className="h-[32px] w-[84px]  shrink-0"
                        onClick={() => {
                          handleSaveEmail();
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primarySecondary"
                      className="p-2 py-0 h-[28px] w-[180px]"
                      onClick={() => setIsEditingEmail(true)}
                    >
                      Update information
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Billing history',
        content: (
          <div className="space-y-2 max-h-[240px] overflow-y-auto" id="billingHistoryTable">
            <InfiniteScroll
              dataLength={tableData.length}
              next={loadMoreHistory}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={<div className="text-center">No more data</div>}
              scrollableTarget="billingHistoryTable"
            >
              <table className="w-full">
                <thead className="text-[#0A1532] font-inter text-sm font-medium text-left">
                  <th className="pb-4">Due Date</th>
                  <th className="pb-4">Description</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Invoice</th>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index} className="text-gray-40 font-inter text-sm font-medium text-left mb-2">
                      <td className="pb-4">{item.dueDate}</td>
                      <td className="pb-4">{item.description}</td>
                      <td className="pb-4">
                        {item.status === 'Success' ? (
                          <span className="border border-[#34C759] rounded-[6px] text-[#34C759] text-[10px] font-inter px-2 py-[2px] font-light leading-[20px]">
                            Paid
                          </span>
                        ) : (
                          <span className="border border-[#FF3B30] rounded-[6px] text-[#FF3B30] text-[10px] font-inter px-2 py-[2px] font-light leading-[20px]">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="pb-4">{item.invoice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>
        )
      }
    ];

    return <Modal title="Orders & Payment" open={open} onOpenChange={onOpenChange} sections={sections} />;
  }
);

AccountSettingsDrawer.displayName = 'AccountSettingsDrawer';
export default AccountSettingsDrawer;

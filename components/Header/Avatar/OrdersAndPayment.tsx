import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';

import Modal from './Modal';
import { Button } from '@/components/ui/button';

import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { Modal as GlobalModal } from '@/utils/modal';
import { paymentList } from '@/components/Membership';
import { handleCancelSubscribe, queryBillingHistory } from '@/lib/api/payment';
import { updateUserInfo } from '@/lib/api/common';
import { showErrorDialog } from '@/utils';

// 邮箱验证函数
const validateEmail = (email: string): boolean => {
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return EMAIL_REGEX.test(email);
};

// 将initialData的声明移到useState之前
const initialData = [
  { dueDate: 'May 4, 2025', description: 'Basic plan', status: 'Paid', invoice: '$19.9' },
  { dueDate: 'May 1, 2025', description: '100 credits', status: 'Paid', invoice: '$10' },
  { dueDate: 'Apr. 1, 2025', description: '100 credits', status: 'Unpaid', invoice: '$10' },
  { dueDate: 'May 4, 2025', description: 'Basic plan', status: 'Paid', invoice: '$19.9' },
  { dueDate: 'May 1, 2025', description: '100 credits', status: 'Paid', invoice: '$10' },
  { dueDate: 'Apr. 1, 2025', description: '100 credits', status: 'Unpaid', invoice: '$10' },
  { dueDate: 'May 4, 2025', description: 'Basic plan', status: 'Paid', invoice: '$19.9' },
  { dueDate: 'May 1, 2025', description: '100 credits', status: 'Paid', invoice: '$10' },
  { dueDate: 'Apr. 1, 2025', description: '100 credits', status: 'Unpaid', invoice: '$10' },
  { dueDate: 'May 4, 2025', description: 'Basic plan', status: 'Paid', invoice: '$19.9' },
  { dueDate: 'May 1, 2025', description: '100 credits', status: 'Paid', invoice: '$10' },
  { dueDate: 'Apr. 1, 2025', description: '100 credits', status: 'Unpaid', invoice: '$10' }
];

const AccountSettingsDrawer = React.memo(
  ({
    open,
    onOpenChange,
    setMembershipVisible
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setMembershipVisible: (open: boolean) => void;
  }) => {
    const { subscribeLevel, billingEmail, renewTime } = usePersonalInfoStore();
    // 编辑用户名的输入框的值
    const [newEmail, setNewEmail] = useState(billingEmail);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    // bill history begins
    const [tableData, setTableData] = useState(initialData); // bill history table data
    const [total, setTotal] = useState(0); // bill history total
    const [hasMore, setHasMore] = useState(true); // bill history has more
    const [page, setPage] = useState(1); // bill history page
    const PAGE_SIZE = 10; // bill history page size
    // bill history ends

    const planInfo = paymentList
      .find(item => item.title === 'Plan')
      ?.type.find(item => item?.subscribeLevel === subscribeLevel);

    // 取消订阅
    const handleCancelSubscription = () => {
      GlobalModal.confirm(
        'Are you sure you want to cancel your subscription?',
        async () => {
          const res = await handleCancelSubscribe();
          console.log('cancel subscription', res);
        },
        () => {}
      );
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

      updateUserInfo(updatePayload)
        .then(res => {
          // 处理响应
          if (res.code === 0) {
            setIsEditingEmail(false);
          } else {
            showErrorDialog(res.message || 'Failed to update billing email');
          }
        })
        .catch(error => {
          // 处理错误
          showErrorDialog(error.message || 'Failed to update billing email');
        });
    }, []);

    // 查询消费记录
    const handleQueryBillingHistory = useCallback(async () => {
      const res = await queryBillingHistory(page, PAGE_SIZE);

      if (res.code === 0) {
        setTableData(prevData => [...prevData, ...res.data.list]);
        setTotal(res.data.total);

        setPage(page + 1);
        // 判断是否还有更多数据
        setHasMore(tableData.length + res.data.list.length < res.data.total);
      } else {
        showErrorDialog(res.message || 'Failed to query billing history');
      }
    }, [page, tableData]);

    useEffect(() => {
      handleQueryBillingHistory();
    }, []);

    // 模拟加载更多数据的函数
    const loadMoreData = () => {
      const moreData = [
        { dueDate: 'Jun. 1, 2025', description: 'Premium plan', status: 'Paid', invoice: '$29.9' },
        { dueDate: 'Jul. 1, 2025', description: '200 credits', status: 'Unpaid', invoice: '$20' }
      ];
      setTableData(prevData => [...prevData, ...moreData]);
    };

    // 添加类型注解
    const handleScroll = (event: Event) => {
      const target = event.target as Document;
      const { scrollTop, scrollHeight, clientHeight } = target.scrollingElement!;
      if (scrollHeight - scrollTop === clientHeight) {
        loadMoreData();
      }
    };

    // 监听滚动事件
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const sections = [
      {
        title: 'Current subscription',
        content: (
          <div className="flex items-center justify-between">
            <div>
              {subscribeLevel === 0 ? (
                <div className="text-[#000] font-inter text-[20px] font-light leading-[20px]">
                  No Current subscription
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-start gap-4">
                    <Image
                      src={`/images/membership/${planInfo?.logo}`}
                      alt="sparkles"
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                    <span className="text-[#000] text-center font-inter text-[20px] font-light leading-[20px]">
                      {planInfo?.title} - $ {planInfo?.price} per month
                    </span>
                  </div>
                  <div className="text-[#000] font-inter text-[14px] font-light leading-[20px]">
                    Your subscription will renew on {dayjs(renewTime).format('MMM DD, YYYY')}
                  </div>
                </div>
              )}
            </div>
            <div>
              {subscribeLevel === 0 ? (
                <Button
                  onClick={() => {
                    setMembershipVisible(true);
                    onOpenChange(false);
                  }}
                  variant="outline"
                  className="p-2 py-0 h-[28px] w-[233px] rounded-[20px] border-none text-white hover:text-[#f0f0f0] text-[14px] leading-[20px] bg-[linear-gradient(69deg,_rgba(0,_143,_247,_0.40)_-34.18%,_rgba(160,_144,_249,_0.40)_5.53%,_rgba(239,_108,_188,_0.40)_42.97%,_rgba(249,_121,_23,_0.40)_82.53%)]"
                >
                  Subscribe Now
                </Button>
              ) : (
                <Button variant="outline" className="p-2 py-0 h-[28px] w-[233px]" onClick={handleCancelSubscription}>
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
                <div className="min-w-[240px] text-[20px] leading-[28px] font-light">E-mail address</div>
                <div className="flex-grow text-[#999] text-[20px] leading-[20px] font-light">
                  {isEditingEmail ? (
                    <>
                      <div className="max-w-[280px]">
                        <input
                          type="text"
                          placeholder="New Email"
                          className="w-full p-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newEmail}
                          onChange={e => setNewEmail(e.target.value)}
                        />
                      </div>
                      {!isEmailValid && (
                        <div className="text-red-500 text-xs mt-1">Please enter a valid email address</div>
                      )}
                    </>
                  ) : (
                    billingEmail
                  )}
                </div>
                <div className="absolute right-0">
                  {isEditingEmail ? (
                    <div className="flex items-center justify-start gap-2">
                      <Button
                        variant="outline"
                        className="p-2 py-0 h-[28px] w-[90px]"
                        onClick={() => {
                          setNewEmail('');
                          setIsEditingEmail(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        className="p-2 py-0 h-[28px] w-[90px]"
                        onClick={() => {
                          handleSaveEmail();
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="p-2 py-0 h-[28px] w-[233px]"
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
              dataLength={tableData.length} // 当前数据长度
              next={handleQueryBillingHistory} // 触底后调用的函数
              hasMore={hasMore} // 是否还有更多数据
              loader={<h4>加载中...</h4>} // 加载动画
              endMessage={<div className="text-center">No more data</div>}
              scrollableTarget="billingHistoryTable"
            >
              <table className="w-full">
                <thead className="text-[#000] font-inter text-[16px] font-normal text-left leading-[20px] space-y-1">
                  <th>Due Date</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Invoice</th>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index} className="text-[#000] font-inter text-[13px] font-light leading-[20px] mb-2">
                      <td>{item.dueDate}</td>
                      <td>{item.description}</td>
                      <td>
                        {item.status === 'Paid' ? (
                          <span className="border border-[#34C759] rounded-[6px] text-[#34C759] text-[10px] font-inter px-2 py-[2px] font-light leading-[20px]">
                            Paid
                          </span>
                        ) : (
                          <span className="border border-[#FF3B30] rounded-[6px] text-[#FF3B30] text-[10px] font-inter px-2 py-[2px] font-light leading-[20px]">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td>{item.invoice}</td>
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

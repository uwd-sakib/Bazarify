import { OpenRouter } from '@openrouter/sdk';
import { config } from '../config/config.js';

// Initialize OpenRouter SDK
const openRouter = new OpenRouter({
  apiKey: config.openRouterApiKey,
  defaultHeaders: {
    'HTTP-Referer': 'https://bazarify.app',
    'X-Title': 'Bazarify SME Platform',
  },
});

// Helper function to call OpenRouter API
const callOpenRouter = async (messages, temperature = 0.7) => {
  try {
    const completion = await openRouter.chat.send({
      model: config.openRouterModel || 'openai/gpt-3.5-turbo',
      messages: messages,
      temperature: temperature,
      stream: false,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    throw new Error('AI সেবা বর্তমানে অনুপলব্ধ। পরে আবার চেষ্টা করুন।');
  }
};

// AI Service Functions
export const aiService = {
  // Generate product description
  generateProductDescription: async (productName, category, price, features = []) => {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant for Bangladeshi SME businesses. Generate product descriptions in Bangla language that are persuasive and SEO-friendly.'
      },
      {
        role: 'user',
        content: `পণ্যের নাম: ${productName}
ক্যাটাগরি: ${category}
মূল্য: ৳${price}
${features.length > 0 ? `বৈশিষ্ট্য: ${features.join(', ')}` : ''}

এই পণ্যের জন্য একটি আকর্ষণীয় এবং বিক্রয়োপযোগী বাংলা বর্ণনা তৈরি করুন (৩-৫ লাইন)।`
      }
    ];

    return await callOpenRouter(messages);
  },

  // Generate business insights
  generateBusinessInsights: async (stats) => {
    const messages = [
      {
        role: 'system',
        content: 'You are a business analyst for Bangladeshi SMEs. Provide actionable insights in Bangla based on business data.'
      },
      {
        role: 'user',
        content: `ব্যবসায়িক তথ্য:
- মোট বিক্রয়: ৳${stats.totalSales || 0}
- মোট অর্ডার: ${stats.totalOrders || 0}
- মোট পণ্য: ${stats.totalProducts || 0}
- মোট গ্রাহক: ${stats.totalCustomers || 0}
- গড় অর্ডার মূল্য: ৳${stats.averageOrderValue || 0}

এই তথ্যের উপর ভিত্তি করে ৩-৫টি ব্যবসায়িক পরামর্শ এবং অন্তর্দৃষ্টি প্রদান করুন (বাংলায়)।`
      }
    ];

    return await callOpenRouter(messages);
  },

  // Generate customer message/SMS
  generateCustomerMessage: async (customerName, messageType, context = {}) => {
    let prompt = '';
    
    switch (messageType) {
      case 'order_confirmation':
        prompt = `${customerName} নামের গ্রাহকের জন্য অর্ডার নিশ্চিতকরণ SMS তৈরি করুন। অর্ডার নম্বর: ${context.orderNumber}, মোট: ৳${context.total}। বার্তাটি সংক্ষিপ্ত (১৬০ অক্ষরের মধ্যে) এবং বন্ধুত্বপূর্ণ হতে হবে।`;
        break;
      case 'payment_reminder':
        prompt = `${customerName} নামের গ্রাহকের জন্য পেমেন্ট রিমাইন্ডার SMS তৈরি করুন। বকেয়া: ৳${context.amount}। বার্তাটি ভদ্র এবং পেশাদার হতে হবে (১৬০ অক্ষরের মধ্যে)।`;
        break;
      case 'promotional':
        prompt = `${customerName} নামের গ্রাহকের জন্য প্রচারমূলক SMS তৈরি করুন। অফার: ${context.offer}। বার্তাটি আকর্ষণীয় এবং সংক্ষিপ্ত হতে হবে (১৬০ অক্ষরের মধ্যে)।`;
        break;
      default:
        prompt = `${customerName} নামের গ্রাহকের জন্য একটি সাধারণ বার্তা তৈরি করুন।`;
    }

    const messages = [
      {
        role: 'system',
        content: 'You are a marketing expert for Bangladeshi businesses. Generate customer messages in Bangla that are professional, friendly, and effective.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await callOpenRouter(messages, 0.8);
  },

  // Analyze sales trends and predict
  analyzeSalesTrend: async (salesData) => {
    const messages = [
      {
        role: 'system',
        content: 'You are a data analyst specializing in Bangladeshi SME sales patterns. Analyze trends and provide predictions in Bangla.'
      },
      {
        role: 'user',
        content: `বিক্রয় তথ্য (গত ৭ দিন):
${salesData.map((day, i) => `দিন ${i + 1}: ৳${day.amount}, অর্ডার: ${day.count}`).join('\n')}

এই তথ্যের উপর ভিত্তি করে:
1. বিক্রয় প্রবণতা বিশ্লেষণ করুন
2. পরবর্তী সপ্তাহের পূর্বাভাস দিন
3. উন্নতির জন্য পরামর্শ দিন

উত্তর বাংলায় প্রদান করুন।`
      }
    ];

    return await callOpenRouter(messages);
  },

  // Generate inventory recommendations
  generateInventoryAdvice: async (products) => {
    const lowStock = products.filter(p => p.stock < 10);
    const outOfStock = products.filter(p => p.stock === 0);
    
    const messages = [
      {
        role: 'system',
        content: 'You are an inventory management expert for Bangladeshi SMEs. Provide practical advice in Bangla.'
      },
      {
        role: 'user',
        content: `ইনভেন্টরি পরিস্থিতি:
- মোট পণ্য: ${products.length}
- কম স্টক (১০-এর নিচে): ${lowStock.length}টি
- স্টক শেষ: ${outOfStock.length}টি
${lowStock.length > 0 ? `\nকম স্টক পণ্য: ${lowStock.map(p => p.name).join(', ')}` : ''}
${outOfStock.length > 0 ? `\nস্টক শেষ পণ্য: ${outOfStock.map(p => p.name).join(', ')}` : ''}

ইনভেন্টরি ব্যবস্থাপনার জন্য পরামর্শ এবং সতর্কতা প্রদান করুন (বাংলায়)।`
      }
    ];

    return await callOpenRouter(messages);
  },

  // AI Chatbot for business queries
  chatWithAI: async (userMessage, conversationHistory = []) => {
    const messages = [
      {
        role: 'system',
        content: `You are "AI মুন্সিজি - আপনার ব্যবসার সহযোগী" (AI Munsiji - Your Business Partner), an AI helper for Bangladeshi SME business owners. You help with:
- ব্যবসায়িক পরামর্শ (Business advice)
- পণ্য ব্যবস্থাপনা (Product management)
- গ্রাহক সেবা (Customer service)
- বিক্রয় কৌশল (Sales strategies)
- আর্থিক পরিকল্পনা (Financial planning)

Always respond in Bangla, be helpful, professional, and provide actionable advice for small business owners in Bangladesh.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    return await callOpenRouter(messages, 0.7);
  },

  // Generate order summary report
  generateOrderReport: async (orders, period) => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgOrderValue = totalRevenue / orders.length;
    
    const messages = [
      {
        role: 'system',
        content: 'You are a business report writer for Bangladeshi SMEs. Generate comprehensive reports in Bangla.'
      },
      {
        role: 'user',
        content: `অর্ডার রিপোর্ট (${period}):
- মোট অর্ডার: ${orders.length}টি
- মোট আয়: ৳${totalRevenue}
- গড় অর্ডার মূল্য: ৳${avgOrderValue.toFixed(2)}
- সফল অর্ডার: ${orders.filter(o => o.status === 'delivered').length}টি
- বাতিল অর্ডার: ${orders.filter(o => o.status === 'cancelled').length}টি
- পেন্ডিং অর্ডার: ${orders.filter(o => o.status === 'pending').length}টি

এই তথ্যের উপর ভিত্তি করে একটি বিস্তারিত রিপোর্ট তৈরি করুন যাতে থাকবে:
1. পারফরম্যান্স সারাংশ
2. মূল অন্তর্দৃষ্টি
3. উন্নতির সুযোগ
4. পরবর্তী পদক্ষেপের পরামর্শ

বাংলায় প্রদান করুন।`
      }
    ];

    return await callOpenRouter(messages);
  },

  // MunshiJi - Unified AI Business Advisor with Tool Calling
  munshiJi: async (userMessage, conversationHistory = [], availableTools = {}) => {
    // Define tools available to MunshiJi
    const tools = [
      {
        type: 'function',
        function: {
          name: 'generate_product_description',
          description: 'পণ্যের জন্য আকর্ষণীয় বাংলা বর্ণনা তৈরি করে',
          parameters: {
            type: 'object',
            properties: {
              productName: { type: 'string', description: 'পণ্যের নাম' },
              category: { type: 'string', description: 'পণ্যের ক্যাটাগরি' },
              price: { type: 'number', description: 'পণ্যের মূল্য (টাকা)' },
              features: { type: 'array', items: { type: 'string' }, description: 'পণ্যের বৈশিষ্ট্য' }
            },
            required: ['productName', 'category']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_business_insights',
          description: 'ব্যবসায়িক তথ্যের উপর ভিত্তি করে পরামর্শ এবং অন্তর্দৃষ্টি প্রদান করে',
          parameters: {
            type: 'object',
            properties: {
              stats: {
                type: 'object',
                properties: {
                  totalSales: { type: 'number', description: 'মোট বিক্রয়' },
                  totalOrders: { type: 'number', description: 'মোট অর্ডার' },
                  totalProducts: { type: 'number', description: 'মোট পণ্য' },
                  totalCustomers: { type: 'number', description: 'মোট গ্রাহক' },
                  averageOrderValue: { type: 'number', description: 'গড় অর্ডার মূল্য' }
                }
              }
            },
            required: ['stats']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'generate_customer_message',
          description: 'গ্রাহকদের জন্য পেশাদার SMS/বার্তা তৈরি করে',
          parameters: {
            type: 'object',
            properties: {
              customerName: { type: 'string', description: 'গ্রাহকের নাম' },
              messageType: { 
                type: 'string', 
                enum: ['order_confirmation', 'payment_reminder', 'promotional'],
                description: 'বার্তার ধরন' 
              },
              context: {
                type: 'object',
                description: 'অতিরিক্ত তথ্য (orderNumber, total, amount, offer ইত্যাদি)'
              }
            },
            required: ['customerName', 'messageType']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'analyze_sales_trend',
          description: 'বিক্রয় প্রবণতা বিশ্লেষণ করে এবং পূর্বাভাস প্রদান করে',
          parameters: {
            type: 'object',
            properties: {
              salesData: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    amount: { type: 'number', description: 'দিনের বিক্রয়' },
                    count: { type: 'number', description: 'অর্ডার সংখ্যা' }
                  }
                },
                description: 'গত ৭ দিনের বিক্রয় তথ্য'
              }
            },
            required: ['salesData']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_inventory_advice',
          description: 'ইনভেন্টরি ব্যবস্থাপনার জন্য স্মার্ট পরামর্শ প্রদান করে',
          parameters: {
            type: 'object',
            properties: {
              products: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'পণ্যের নাম' },
                    stock: { type: 'number', description: 'বর্তমান স্টক' }
                  }
                },
                description: 'পণ্যের তালিকা'
              }
            },
            required: ['products']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'generate_order_report',
          description: 'অর্ডারের বিস্তারিত রিপোর্ট তৈরি করে',
          parameters: {
            type: 'object',
            properties: {
              orders: {
                type: 'array',
                items: { type: 'object' },
                description: 'অর্ডার তালিকা'
              },
              period: {
                type: 'string',
                description: 'সময়কাল (যেমন: গত ৭ দিন, গত ৩০ দিন)'
              }
            },
            required: ['orders', 'period']
          }
        }
      }
    ];

    const systemMessage = {
      role: 'system',
      content: `আপনি "মুন্সিজি" - একজন বুদ্ধিমান বাংলাদেশী ব্যবসায়িক উপদেষ্টা। আপনি ছোট ও মাঝারি ব্যবসায়ীদের (SME) সাহায্য করেন।

**আপনার ক্ষমতা:**
- পণ্য বর্ণনা তৈরি
- ব্যবসায়িক বিশ্লেষণ ও পরামর্শ
- গ্রাহক বার্তা লেখা
- বিক্রয় প্রবণতা বিশ্লেষণ
- ইনভেন্টরি ব্যবস্থাপনা পরামর্শ
- অর্ডার রিপোর্ট তৈরি

**নির্দেশনা:**
1. সবসময় বাংলায় উত্তর দিন
2. ব্যবসায়ীদের সাথে বন্ধুত্বপূর্ণ ও পেশাদার ভাবে কথা বলুন
3. যখন প্রয়োজন হবে তখন টুল ব্যবহার করুন (function calling)
4. সহজ, স্পষ্ট এবং কার্যকর পরামর্শ দিন
5. বাংলাদেশী ব্যবসায়িক পরিবেশের কথা মাথায় রাখুন
6. ব্যবহারকারীকে "আপনি" সম্বোধন করুন

আপনি একজন বিশ্বস্ত ব্যবসায়িক সহযোগী। সবসময় ইতিবাচক, সহায়ক এবং সমাধানমুখী থাকুন।`
    };

    try {
      // First API call with tools
      const completion = await openRouter.chat.send({
        model: config.openRouterModel || 'openai/gpt-4-turbo',
        messages: [
          systemMessage,
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        tools: tools,
        tool_choice: 'auto',
        temperature: 0.7,
        stream: false,
      });

      const responseMessage = completion.choices[0].message;
      
      // Check if AI wants to use tools
      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        // Execute tool calls
        const toolResults = [];
        
        for (const toolCall of responseMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          
          let result;
          
          // Execute the appropriate function
          switch (functionName) {
            case 'generate_product_description':
              result = await aiService.generateProductDescription(
                functionArgs.productName,
                functionArgs.category,
                functionArgs.price,
                functionArgs.features || []
              );
              break;
            
            case 'get_business_insights':
              result = await aiService.generateBusinessInsights(functionArgs.stats);
              break;
            
            case 'generate_customer_message':
              result = await aiService.generateCustomerMessage(
                functionArgs.customerName,
                functionArgs.messageType,
                functionArgs.context || {}
              );
              break;
            
            case 'analyze_sales_trend':
              result = await aiService.analyzeSalesTrend(functionArgs.salesData);
              break;
            
            case 'get_inventory_advice':
              result = await aiService.generateInventoryAdvice(functionArgs.products);
              break;
            
            case 'generate_order_report':
              result = await aiService.generateOrderReport(
                functionArgs.orders,
                functionArgs.period
              );
              break;
            
            default:
              result = 'টুল পাওয়া যায়নি';
          }
          
          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            name: functionName,
            content: JSON.stringify(result)
          });
        }
        
        // Second API call with tool results
        const finalCompletion = await openRouter.chat.send({
          model: config.openRouterModel || 'openai/gpt-4-turbo',
          messages: [
            systemMessage,
            ...conversationHistory,
            { role: 'user', content: userMessage },
            responseMessage,
            ...toolResults
          ],
          temperature: 0.7,
          stream: false,
        });
        
        return {
          response: finalCompletion.choices[0].message.content,
          toolsUsed: responseMessage.tool_calls.map(tc => tc.function.name)
        };
      } else {
        // No tools needed, return direct response
        return {
          response: responseMessage.content,
          toolsUsed: []
        };
      }
    } catch (error) {
      console.error('MunshiJi Error:', error.message);
      throw new Error('মুন্সিজি বর্তমানে অনুপলব্ধ। পরে আবার চেষ্টা করুন।');
    }
  }
};

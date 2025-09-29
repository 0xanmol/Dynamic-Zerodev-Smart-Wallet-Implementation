# Dynamic Embedded Wallet FAQ

## Enterprise Evaluation Questions

### User Experience & Onboarding

**Q: How does the user onboarding experience compare to traditional wallets?**

A: It's night and day. Traditional wallets require users to understand seed phrases, private keys, and gas fees. With Dynamic, users just sign in with email or social login - same as any Web2 app. The smart wallet gets created behind the scenes.

**Q: Can users recover their accounts if they lose access?**

A: Yes! Dynamic supports social recovery through email verification and social login methods. Users can recover their accounts without seed phrases or complex recovery processes.

**Q: What happens if a user forgets their password?**

A: Since authentication is handled through email/social login, users can reset their passwords through standard Web2 recovery flows. The embedded wallet remains accessible once they regain account access.

### Security & Compliance

**Q: How secure are embedded wallets compared to hardware wallets?**

A: Embedded wallets use smart contracts with customizable security rules. While hardware wallets provide the highest security for individual users, embedded wallets offer better UX with enterprise-grade security features like MFA, social recovery, and transaction limits.

**Q: Can we implement custom security policies?**

A: Yes! Smart contract wallets can implement custom logic for:
- Transaction limits and approval workflows
- Time-locked operations
- Multi-signature requirements
- Custom authentication methods

**Q: How do we handle compliance and KYC requirements?**

A: Dynamic integrates with identity verification providers and can implement custom compliance workflows. The embedded wallet can enforce KYC requirements before allowing certain transactions.

**Q: What about regulatory compliance in different jurisdictions?**

A: Dynamic provides compliance tools and can integrate with regulatory reporting systems. The smart contract logic can be customized to meet specific jurisdictional requirements.
### Technical Integration


**Q: How difficult is it to integrate Dynamic into our existing application?**

A: Pretty straightforward actually. The demo I built shows the full implementation - gasless transactions, NFT minting, MFA, the works. Most of the heavy lifting is:
- Adding the Dynamic provider to your app
- Configuring authentication methods  
- Setting up smart wallet parameters
- Getting ZeroDev configured for gasless transactions

**Q: Can we use our existing authentication system?**

A: Yes! Dynamic can integrate with existing authentication systems through custom authentication providers. You can maintain your current user management while adding Web3 capabilities.

**Q: How do we handle multi-chain support?**

A: Dynamic supports multiple networks out of the box. The demo shows both Base Sepolia and Ethereum Sepolia with automatic chain switching. You can easily add Ethereum, Polygon, Arbitrum, and other networks. Users can switch between chains seamlessly, and the app automatically uses the correct contract addresses for each network.

**Q: What about mobile app integration?**

A: Dynamic provides React Native and Flutter SDKs for mobile integration. The embedded wallet works consistently across web and mobile platforms.

### Cost & Economics

**Q: How much do gasless transactions cost us as the application provider?**

A: Gas fees are sponsored by paymaster services like ZeroDev. Costs depend on:
- Transaction volume
- Network gas prices
- Paymaster policies
- Your sponsorship budget

The demo uses ZeroDev's paymaster service, which sponsors all gas fees for your users. You can set spending limits and policies to control costs.

**Q: Can we implement our own paymaster to control costs?**

A: Yes! You can deploy your own paymaster contract to have full control over gas sponsorship policies and costs. This allows for custom business logic around when to sponsor transactions.

**Q: What's the pricing model for Dynamic's services?**

A: Dynamic offers flexible pricing based on:
- Number of active users
- Transaction volume
- Feature usage
- Support level required

Contact Dynamic sales for enterprise pricing details.

### Scalability & Performance

**Q: How does this scale with our user base?**

A: Dynamic's infrastructure is designed for enterprise scale:
- Smart wallets are deployed on-demand
- Paymaster services handle high transaction volumes
- CDN distribution for global performance
- Auto-scaling infrastructure

**Q: What are the performance implications?**

A: Embedded wallets actually improve performance:
- No need to download blockchain data
- Optimized transaction batching
- Reduced user interaction friction
- Faster onboarding and transactions

**Q: How do we handle high-frequency trading or DeFi operations?**

A: Smart contract wallets can implement:
- Batch transaction processing
- Custom execution logic
- Gas optimization strategies
- MEV protection mechanisms

### Development & Maintenance

**Q: How much ongoing maintenance is required?**

A: Minimal maintenance required:
- Dynamic handles infrastructure updates
- Smart contract upgrades are managed by Dynamic
- SDK updates are backward compatible
- Monitoring and alerting are built-in

**Q: Can our development team customize the wallet behavior?**

A: Yes! You can:
- Deploy custom smart contracts
- Implement custom authentication flows
- Add custom transaction logic
- Integrate with your existing systems

**Q: What about testing and development environments?**

A: Dynamic provides:
- Testnet environments for development
- Staging environments for testing
- Production environments for live deployment
- Comprehensive testing tools and documentation

### Migration & Adoption

**Q: How do we migrate existing users to embedded wallets?**

A: Migration strategies include:
- Gradual rollout to new users first
- Import existing wallet functionality
- Hybrid approach with both wallet types
- User education and onboarding flows

**Q: What if users want to export their wallets?**

A: Dynamic supports wallet export functionality, allowing users to:
- Export private keys (if needed)
- Migrate to other wallet providers
- Maintain control over their assets
- Follow standard Web3 practices

**Q: How do we handle user education about the new system?**

A: The demo includes educational components that explain:
- How embedded wallets work
- Benefits over traditional wallets
- Security features and best practices
- Transaction flow and gas sponsorship
- Account Abstraction concepts

The "How It Works" section in the demo provides a clear explanation that you can customize for your users.

### Advanced Features

**Q: Can we implement custom transaction logic?**

A: Yes! Smart contract wallets support:
- Conditional transactions
- Time-locked operations
- Multi-step transaction flows
- Custom approval mechanisms

**Q: How do we handle complex DeFi operations?**

A: Embedded wallets can:
- Batch multiple DeFi transactions
- Implement custom slippage protection
- Handle complex approval flows
- Optimize gas usage across operations

**Q: Can we integrate with our existing payment systems?**

A: Yes! Dynamic can integrate with:
- Traditional payment processors
- Banking APIs
- Credit card systems
- Cryptocurrency exchanges

### Support & Documentation

**Q: What kind of support is available?**

A: Dynamic provides:
- Technical documentation and guides
- Developer Discord community
- Enterprise support channels
- Custom implementation assistance

**Q: How do we get help with implementation?**

A: Support options include:
- Comprehensive documentation
- Code examples and tutorials
- Community forums and Discord
- Direct technical support for enterprise customers

**Q: What about training for our development team?**

A: Dynamic offers:
- Technical workshops and training
- Implementation best practices
- Code review and optimization
- Ongoing technical consultation

## Getting Started

### Next Steps for Evaluation

1. **Test the Demo**: Run the provided demo to experience the UX
2. **Review Documentation**: Study the implementation details
3. **Technical Deep Dive**: Explore the code and architecture
4. **Pilot Program**: Plan a small-scale pilot with your team
5. **Production Planning**: Design your production implementation

### Contact Information

- **Dynamic Sales**: [sales@dynamic.xyz](mailto:sales@dynamic.xyz)
- **Technical Support**: [Discord Community](https://discord.gg/dynamic)
- **Documentation**: [docs.dynamic.xyz](https://docs.dynamic.xyz)
- **Enterprise Support**: Contact your Dynamic representative

---
*This FAQ addresses common enterprise concerns about Dynamic's embedded wallet technology. For specific technical questions, please contact Dynamic's technical team.*

function formatNumber(num) {
    return num.toLocaleString('en-US');
}

function calculateGenieActions() {
    const users = parseFloat(document.getElementById('genie-users').value) || 0;
    const sessionsPerUser = parseFloat(document.getElementById('sessions-per-user').value) || 0;
    const messagesPerSession = parseFloat(document.getElementById('messages-per-session').value) || 0;
    
    const userInitiatedActions = users * sessionsPerUser * messagesPerSession;
    
    // Update the display
    document.getElementById('calculated-genie-actions').textContent = formatNumber(Math.round(userInitiatedActions));
    
    // Update total with app events
    updateTotalGenieActions();
}

function calculateAppEvents() {
    const users = parseFloat(document.getElementById('genie-users').value) || 0;
    const appEventsPerUser = parseFloat(document.getElementById('app-events-per-user').value) || 0;
    const responseRate = parseFloat(document.getElementById('app-event-response-rate').value) / 100 || 0;
    const followUps = parseFloat(document.getElementById('app-event-followups').value) || 0;
    
    // Each app event generates 2 Genie Actions automatically
    const totalAppEvents = users * appEventsPerUser;
    const baseAppEventGenieActions = totalAppEvents * 2;
    
    // Additional Genie Actions from user responses
    const respondedEvents = totalAppEvents * responseRate;
    const followUpGenieActions = respondedEvents * followUps;
    
    const totalAppEventGenieActions = baseAppEventGenieActions + followUpGenieActions;
    
    // Update displays
    document.getElementById('app-event-genie-actions').textContent = formatNumber(Math.round(totalAppEventGenieActions));
    document.getElementById('app-event-business-actions').textContent = formatNumber(Math.round(totalAppEvents));
    
    // Update total
    updateTotalGenieActions();
}

function updateTotalGenieActions() {
    const userInitiated = parseFloat(document.getElementById('calculated-genie-actions').textContent.replace(/,/g, '')) || 0;
    const appEventActions = parseFloat(document.getElementById('app-event-genie-actions').textContent.replace(/,/g, '')) || 0;
    
    const total = userInitiated + appEventActions;
    document.getElementById('genie-actions').value = Math.round(total);
    
    // Trigger main calculation
    calculateCredits();
}

function calculateCredits() {
    // Get input values
    const genieActions = parseFloat(document.getElementById('genie-actions').value) || 0;
    const idpPages = parseFloat(document.getElementById('idp-pages').value) || 0;
    const goUsers = parseFloat(document.getElementById('go-users').value) || 0;
    const mcpCalls = parseFloat(document.getElementById('mcp-calls').value) || 0;
    
    // Get app event business actions
    const users = parseFloat(document.getElementById('genie-users').value) || 0;
    const appEventsPerUser = parseFloat(document.getElementById('app-events-per-user').value) || 0;
    const totalAppEvents = users * appEventsPerUser;
    
    // Get session data for IDP calculation
    const sessionsPerUser = parseFloat(document.getElementById('sessions-per-user').value) || 0;
    const totalSessions = users * sessionsPerUser;
    
    // Credit rates
    const GENIE_RATE = 20;
    const BUSINESS_ACTION_RATE = 2.8;
    const IDP_RATE = 33.3;
    const GO_USER_RATE = 25000;
    const MCP_RATE = 0.5;
    const GO_INCLUDED_USERS = 1000;
    
    // Calculate credits
    const genieCredits = genieActions * GENIE_RATE;
    const appEventBACredits = totalAppEvents * BUSINESS_ACTION_RATE; // App events count as business actions
    const idpCredits = totalSessions * idpPages * IDP_RATE; // IDP is per session
    const additionalGoUsers = Math.max(0, goUsers - GO_INCLUDED_USERS);
    const goCredits = additionalGoUsers * GO_USER_RATE;
    const mcpCredits = mcpCalls * MCP_RATE;
    
    const totalCredits = genieCredits + appEventBACredits + idpCredits + goCredits + mcpCredits;
    
    // Update display
    document.getElementById('genie-credits').textContent = formatNumber(Math.round(genieCredits));
    document.getElementById('app-event-ba-credits').textContent = formatNumber(Math.round(appEventBACredits));
    document.getElementById('idp-credits').textContent = formatNumber(Math.round(idpCredits));
    document.getElementById('go-credits').textContent = formatNumber(Math.round(goCredits));
    document.getElementById('mcp-credits').textContent = formatNumber(Math.round(mcpCredits));
    document.getElementById('total-credits').textContent = formatNumber(Math.round(totalCredits));
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Calculate on page load
    calculateAppEvents();
    calculateGenieActions();
    calculateCredits();
    
    // Add event listeners for real-time calculation
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.id.includes('app-event')) {
                calculateAppEvents();
            } else if (this.id === 'genie-users' || this.id === 'sessions-per-user' || this.id === 'messages-per-session') {
                calculateGenieActions();
                calculateAppEvents(); // Also recalculate app events since users changed
            } else {
                calculateCredits();
            }
        });
    });
});
